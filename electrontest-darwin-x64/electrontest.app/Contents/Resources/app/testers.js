function introPy1(text, result) {
  return text.includes('print')
}
function introPy2(text, result) {
  return text.includes('=')
}
function introPy3(text, result) {
  return text.includes('+') || text.includes('-') || text.includes('/') || text.includes('*')
}
