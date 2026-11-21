// Fast, dependency-free exact drop-in for csv-reader 1.0.0.
export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const n = text.length;
  let pos = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let line = 1, recordLine = 1, recordRow = null, width = -1, columns = null;
  const rows = [], errors = [];
  const err = code => errors.push({ code, line: recordLine, row: recordRow });
  function unquoted(initial = "") {
    let start = pos, pieces = initial ? [initial] : null, added = 0;
    while (pos < n) {
      const c = text.charCodeAt(pos);
      if (c === 44 || c === 10) {
        if (pos > start) { (pieces ||= []).push(text.slice(start, pos)); added += pos - start; }
        if (c === 44) { pos++; return { value: pieces ? pieces.join("") : "", end: 1, added }; }
        pos++; line++; return { value: pieces ? pieces.join("") : "", end: 2, added };
      }
      if (c === 13) {
        if (pos > start) { (pieces ||= []).push(text.slice(start, pos)); added += pos - start; }
        if (text.charCodeAt(pos + 1) === 10) { pos += 2; line++; return { value: pieces ? pieces.join("") : "", end: 2, added }; }
        err("stray_cr"); pos++; start = pos; continue;
      }
      pos++;
    }
    if (pos > start) { (pieces ||= []).push(text.slice(start, pos)); added += pos - start; }
    return { value: pieces ? pieces.join("") : "", end: 0, added };
  }
  function quoted() {
    const open = pos, openLine = line; pos++; let start = pos, pieces = null, closed = false;
    while (pos < n) {
      const c = text.charCodeAt(pos);
      if (c === 34) {
        if (text.charCodeAt(pos + 1) === 34) { (pieces ||= []).push(text.slice(start, pos), "\""); pos += 2; start = pos; continue; }
        if (pos > start) (pieces ||= []).push(text.slice(start, pos)); pos++; closed = true; break;
      }
      if (c === 13 || c === 10) {
        if (c === 13) { if (pos > start) (pieces ||= []).push(text.slice(start, pos)); (pieces ||= []).push("\n"); pos += text.charCodeAt(pos + 1) === 10 ? 2 : 1; start = pos; line++; }
        else { pos++; line++; }
      } else pos++;
    }
    if (!closed) { pos = open + 1; line = openLine; err("unterminated_quote"); return unquoted("\""); }
    const value = pieces ? pieces.join("") : text.slice(start, pos - 1);
    if (pos >= n) return { value, end: 0 };
    const c = text.charCodeAt(pos);
    if (c === 44) { pos++; return { value, end: 1 }; }
    if (c === 10) { pos++; line++; return { value, end: 2 }; }
    if (c === 13 && text.charCodeAt(pos + 1) === 10) { pos += 2; line++; return { value, end: 2 }; }
    const junk = unquoted(value); if (junk.added > 0) err("quote_junk"); return junk;
  }
  while (true) {
    while (pos < n) { const c = text.charCodeAt(pos); if (c === 10) { pos++; line++; } else if (c === 13 && text.charCodeAt(pos + 1) === 10) { pos += 2; line++; } else break; }
    if (pos >= n) break; recordLine = line; recordRow = header && columns === null ? null : rows.length;
    const fields = []; let field, wasQuoted;
    do { wasQuoted = text.charCodeAt(pos) === 34; field = wasQuoted ? quoted() : unquoted(); fields.push(field.value); } while (field.end === 1);
    if (fields.length === 1 && fields[0] === "" && !wasQuoted) continue;
    if (width < 0) width = fields.length;
    if (header && columns === null) { columns = fields; continue; }
    if (fields.length < width) { errors.push({ code: "short_row", line: recordLine, row: recordRow, fields: fields.length }); while (fields.length < width) fields.push(""); }
    else if (fields.length > width) errors.push({ code: "long_row", line: recordLine, row: recordRow, extra: fields.splice(width) });
    rows.push(fields);
  }
  return { columns: header ? (columns ?? []) : null, rows, errors };
}
