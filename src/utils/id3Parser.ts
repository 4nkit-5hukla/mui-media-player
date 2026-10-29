import { ID3Metadata, LyricLine } from "../types/tracks";

/**
 * Decodes buffer slice into string using appropriate TextDecoder based on ID3 encoding byte.
 * 0: ISO-8859-1
 * 1: UTF-16 with BOM
 * 2: UTF-16BE without BOM
 * 3: UTF-8
 */
function decodeText(bytes: Uint8Array, encodingByte: number): string {
  let str = "";
  try {
    if (encodingByte === 3) {
      str = new TextDecoder("utf-8").decode(bytes);
    } else if (encodingByte === 1) {
      str = new TextDecoder("utf-16").decode(bytes);
    } else if (encodingByte === 2) {
      str = new TextDecoder("utf-16be").decode(bytes);
    } else {
      str = new TextDecoder("iso-8859-1").decode(bytes);
    }
  } catch {
    str = new TextDecoder("utf-8").decode(bytes);
  }
  return str.replace(/\0/g, "").trim();
}

/**
 * Finds index of null delimiter in bytes based on encoding.
 * 1 and 2 (UTF-16) use double null (0x00 0x00) with even alignment.
 */
function findNullDelimiter(bytes: Uint8Array, start: number, encodingByte: number): number {
  if (encodingByte === 1 || encodingByte === 2) {
    for (let i = start; i < bytes.length - 1; i += 2) {
      if (bytes[i] === 0 && bytes[i + 1] === 0) {
        return i;
      }
    }
  } else {
    for (let i = start; i < bytes.length; i++) {
      if (bytes[i] === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Converts synchsafe 4-byte integer (7 bits per byte) into regular 32-bit integer.
 */
function readSynchsafeInt(data: DataView, offset: number): number {
  return (
    ((data.getUint8(offset) & 0x7f) << 21) |
    ((data.getUint8(offset + 1) & 0x7f) << 14) |
    ((data.getUint8(offset + 2) & 0x7f) << 7) |
    (data.getUint8(offset + 3) & 0x7f)
  );
}

/**
 * Converts Uint8Array into base64 string.
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Parses USLT (Unsynchronized lyrics) frame.
 */
function parseUSLTFrame(frameBytes: Uint8Array): string | null {
  if (frameBytes.length < 5) return null;
  const encoding = frameBytes[0];
  // bytes 1..3: language (skip)
  const descNullIdx = findNullDelimiter(frameBytes, 4, encoding);
  const textStart = descNullIdx !== -1 ? descNullIdx + (encoding === 1 || encoding === 2 ? 2 : 1) : 4;
  if (textStart >= frameBytes.length) return null;

  return decodeText(frameBytes.slice(textStart), encoding).trim();
}

/**
 * Parses SYLT (Synchronized lyrics) frame.
 */
function parseSYLTFrame(frameBytes: Uint8Array): LyricLine[] {
  if (frameBytes.length < 6) return [];
  const encoding = frameBytes[0];
  // bytes 1..3: language
  const timestampFormat = frameBytes[4]; // 1 = MPEG frames, 2 = milliseconds
  // byte 5: content type
  const descNullIdx = findNullDelimiter(frameBytes, 6, encoding);
  let pos = descNullIdx !== -1 ? descNullIdx + (encoding === 1 || encoding === 2 ? 2 : 1) : 6;

  const lines: LyricLine[] = [];
  const isMs = timestampFormat === 2;

  while (pos < frameBytes.length) {
    const textNullIdx = findNullDelimiter(frameBytes, pos, encoding);
    if (textNullIdx === -1) break;

    const textBytes = frameBytes.slice(pos, textNullIdx);
    const text = decodeText(textBytes, encoding).trim();
    pos = textNullIdx + (encoding === 1 || encoding === 2 ? 2 : 1);

    if (pos + 4 > frameBytes.length) break;
    const view = new DataView(frameBytes.buffer, frameBytes.byteOffset + pos, 4);
    const rawTime = view.getUint32(0, false);
    pos += 4;

    const timeInSeconds = isMs ? rawTime / 1000 : rawTime / 38.28; // approximation for MPEG frames if ms not used
    if (text) {
      lines.push({ time: Math.round(timeInSeconds * 100) / 100, text });
    }
  }

  lines.sort((a, b) => a.time - b.time);
  return lines;
}

/**
 * Parses APIC (Attached picture) frame.
 */
function parseAPICFrame(frameBytes: Uint8Array, isV22 = false): string | null {
  if (frameBytes.length < 10) return null;
  const encoding = frameBytes[0];
  let pos = 1;

  let mimeType = "image/jpeg";
  if (isV22) {
    // 3 bytes format e.g. "JPG" or "PNG"
    const fmt = String.fromCharCode(frameBytes[1], frameBytes[2], frameBytes[3]).toLowerCase();
    mimeType = fmt === "png" ? "image/png" : "image/jpeg";
    pos = 4;
  } else {
    // MIME type null-terminated ASCII string
    const mimeEnd = findNullDelimiter(frameBytes, pos, 0);
    if (mimeEnd !== -1) {
      mimeType = new TextDecoder("ascii").decode(frameBytes.slice(pos, mimeEnd)).trim();
      pos = mimeEnd + 1;
    }
  }

  // Picture type (1 byte)
  pos += 1;

  // Description (null-terminated according to encoding)
  const descEnd = findNullDelimiter(frameBytes, pos, encoding);
  pos = descEnd !== -1 ? descEnd + (encoding === 1 || encoding === 2 ? 2 : 1) : pos;

  if (pos >= frameBytes.length) return null;

  const imageBytes = frameBytes.slice(pos);
  const base64 = bytesToBase64(imageBytes);
  return `data:${mimeType || "image/jpeg"};base64,${base64}`;
}

/**
 * Parses an ArrayBuffer containing an MP3 or audio file's ID3v2 tag.
 */
export function parseID3FromBuffer(buffer: ArrayBuffer): ID3Metadata {
  if (buffer.byteLength < 10) return {};

  const data = new DataView(buffer);

  // Check ID3 magic bytes
  if (
    data.getUint8(0) !== 0x49 || // 'I'
    data.getUint8(1) !== 0x44 || // 'D'
    data.getUint8(2) !== 0x33    // '3'
  ) {
    return {};
  }

  const majorVersion = data.getUint8(3); // 2, 3, or 4
  const tagSize = readSynchsafeInt(data, 6);
  const totalTagLength = Math.min(10 + tagSize, buffer.byteLength);

  const metadata: ID3Metadata = {};
  let offset = 10;

  // Flags check (extended header in ID3v2.3/4)
  const flags = data.getUint8(5);
  if (majorVersion >= 3 && (flags & 0x40) !== 0 && offset + 4 <= totalTagLength) {
    const extHeaderSize = readSynchsafeInt(data, offset);
    offset += Math.max(extHeaderSize, 4);
  }

  const isV22 = majorVersion === 2;
  const headerSize = isV22 ? 6 : 10;

  while (offset + headerSize <= totalTagLength) {
    // If we encounter padding zeroes
    if (data.getUint8(offset) === 0) {
      break;
    }

    let frameId = "";
    let frameSize = 0;

    if (isV22) {
      frameId = String.fromCharCode(
        data.getUint8(offset),
        data.getUint8(offset + 1),
        data.getUint8(offset + 2)
      );
      frameSize =
        (data.getUint8(offset + 3) << 16) |
        (data.getUint8(offset + 4) << 8) |
        data.getUint8(offset + 5);
      offset += 6;
    } else {
      frameId = String.fromCharCode(
        data.getUint8(offset),
        data.getUint8(offset + 1),
        data.getUint8(offset + 2),
        data.getUint8(offset + 3)
      );
      if (majorVersion === 4) {
        frameSize = readSynchsafeInt(data, offset + 4);
      } else {
        frameSize = data.getUint32(offset + 4, false);
      }
      offset += 10;
    }

    if (frameSize <= 0 || offset + frameSize > totalTagLength) {
      break;
    }

    const frameBytes = new Uint8Array(buffer, offset, frameSize);
    offset += frameSize;

    // Parse specific frames
    if (frameId === "TIT2" || frameId === "TT2") {
      metadata.title = decodeText(frameBytes.slice(1), frameBytes[0]).trim();
    } else if (frameId === "TPE1" || frameId === "TP1") {
      metadata.artist = decodeText(frameBytes.slice(1), frameBytes[0]).trim();
    } else if (frameId === "TALB" || frameId === "TAL") {
      metadata.album = decodeText(frameBytes.slice(1), frameBytes[0]).trim();
    } else if (frameId === "TYER" || frameId === "TDRC" || frameId === "TYE") {
      metadata.year = decodeText(frameBytes.slice(1), frameBytes[0]).trim();
    } else if (frameId === "TCON" || frameId === "TCO") {
      metadata.genre = decodeText(frameBytes.slice(1), frameBytes[0]).trim();
    } else if (frameId === "USLT" || frameId === "ULT") {
      const lyricsText = parseUSLTFrame(frameBytes);
      if (lyricsText) {
        if (!metadata.lyrics) metadata.lyrics = { source: "id3" };
        metadata.lyrics.rawText = lyricsText;
      }
    } else if (frameId === "SYLT" || frameId === "SLT") {
      const lines = parseSYLTFrame(frameBytes);
      if (lines.length > 0) {
        if (!metadata.lyrics) metadata.lyrics = { source: "id3" };
        metadata.lyrics.lines = lines;
      }
    } else if (frameId === "APIC" || frameId === "PIC") {
      const artDataUri = parseAPICFrame(frameBytes, isV22);
      if (artDataUri) {
        metadata.albumArt = artDataUri;
      }
    }
  }

  // Propagate title and artist into lyrics if available
  if (metadata.lyrics) {
    if (metadata.title) metadata.lyrics.title = metadata.title;
    if (metadata.artist) metadata.lyrics.artist = metadata.artist;
  }

  return metadata;
}

/**
 * Extracts ID3 metadata from a Blob or File object.
 */
export async function extractID3FromBlob(blob: Blob): Promise<ID3Metadata> {
  try {
    // Read first 128KB which is plenty for headers, lyrics and album art
    const slice = blob.slice(0, Math.min(blob.size, 131072));
    const arrayBuffer = await slice.arrayBuffer();
    return parseID3FromBuffer(arrayBuffer);
  } catch (error) {
    console.warn("Failed to extract ID3 from blob", error);
    return {};
  }
}

/**
 * Extracts ID3 metadata from a remote audio URL using HTTP Range request.
 */
export async function extractID3FromUrl(url: string, rangeBytes = 131072): Promise<ID3Metadata> {
  if (!url || url.startsWith("blob:") || url.startsWith("data:")) {
    return {};
  }

  try {
    const response = await fetch(url, {
      headers: {
        Range: `bytes=0-${rangeBytes - 1}`,
      },
    });

    if (!response.ok && response.status !== 206) {
      return {};
    }

    const buffer = await response.arrayBuffer();
    return parseID3FromBuffer(buffer);
  } catch {
    // Network or CORS restriction on Range request, ignore silently
    return {};
  }
}
