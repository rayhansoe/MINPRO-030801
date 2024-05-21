export const getUTCTimestamp = (datetime: Date)=> {
  let x = new Date(datetime).getTime() + 7 * 60 * 60 * 1000
  const d = new Date(x).toISOString().split('T')
  const date = d[0];
  const time = d[1].split('.')[0];
  
  return `${date} ${time}`
}