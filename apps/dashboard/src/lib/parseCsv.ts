/**
 * RFC-4180-compliant CSV parser.
 *
 * Handles:
 *  - Quoted fields containing commas  e.g. "Choudhury, Bakshi and Maharaj Works Dept"
 *  - Quoted fields containing newlines (multi-line values)
 *  - Empty fields                     e.g. anomaly_type is blank for non-synthetic rows
 *  - CRLF and LF line endings
 *
 * Returns an array of objects keyed by the header row.
 */
export function parseCsv(raw: string): Record<string, string>[] {
  const results: Record<string, string>[] = []
  const len = raw.length
  let pos = 0

  // Parse one field starting at current pos, advances pos past delimiter/EOL
  function parseField(): string {
    if (pos >= len) return ''

    if (raw[pos] === '"') {
      // Quoted field
      pos++ // skip opening quote
      let value = ''
      while (pos < len) {
        if (raw[pos] === '"') {
          if (raw[pos + 1] === '"') {
            // Escaped quote
            value += '"'
            pos += 2
          } else {
            pos++ // skip closing quote
            break
          }
        } else {
          value += raw[pos]
          pos++
        }
      }
      // Skip trailing comma or newline after closing quote
      if (pos < len && raw[pos] === ',') pos++
      return value
    } else {
      // Unquoted field — read until comma or newline
      const start = pos
      while (pos < len && raw[pos] !== ',' && raw[pos] !== '\n' && raw[pos] !== '\r') {
        pos++
      }
      const value = raw.slice(start, pos)
      if (pos < len && raw[pos] === ',') pos++
      return value
    }
  }

  // Parse one row, returns array of field strings or null at EOF
  function parseRow(): string[] | null {
    if (pos >= len) return null
    // Skip CRLF / LF from previous row end
    while (pos < len && (raw[pos] === '\r' || raw[pos] === '\n')) pos++
    if (pos >= len) return null

    const fields: string[] = []
    const rowStart = pos
    while (pos < len && raw[pos] !== '\n' && raw[pos] !== '\r') {
      // peek — if we're in a quoted field, parseField will consume newlines inside quotes
      fields.push(parseField())
      // After parseField, pos is either at \r\n, \n, next comma already consumed, or EOF
      // If pos is on \r or \n we are done with this row
      if (pos < len && (raw[pos] === '\r' || raw[pos] === '\n')) break
    }
    // If nothing was consumed (blank line at end), skip
    if (pos === rowStart) return null
    return fields
  }

  // Read header row
  const headers = parseRow()
  if (!headers || headers.length === 0) return results

  // Read data rows
  while (pos < len) {
    const fields = parseRow()
    if (fields === null) break
    if (fields.length === 0) continue
    // Skip rows that are completely blank (e.g. trailing newline)
    if (fields.length === 1 && fields[0] === '') continue

    const row: Record<string, string> = {}
    for (let i = 0; i < headers.length; i++) {
      row[headers[i] ?? ''] = fields[i] ?? ''
    }
    results.push(row)
  }

  return results
}
