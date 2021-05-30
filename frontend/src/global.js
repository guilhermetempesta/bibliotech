import Vue from 'vue'

export const userKey = '__bibliotech_user'
export const baseApiUrl = "http://localhost:3000"

export function showError(e) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultError({ message: e.response.data.message })
  } else if (typeof e==='string') {
    Vue.toasted.global.defaultError({ message: e })
  } else {
    Vue.toasted.global.defaultError()
  }
}

export function showSuccessMsg(e) {
  if (e && e.response && e.response.data) {
    Vue.toasted.global.defaultSuccess({ message: e.response.data.message })
  } else if (typeof e==='string') {
    Vue.toasted.global.defaultSuccess({ message: e })
  } else {
    Vue.toasted.global.defaultSuccess()
  }
}

export function decodeToken(token) {
  let base64Url = token.split('.')[1]; // pega os dados do payload
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
}

export function formatDate(date) {
  const formatted = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON().slice(0, 10)
  return formatted
}

export function addDaysOnDate(date, days) {
  date.setDate(date.getDate() + days)
  date.getDate()
  return date
}

// Get property value by key/nested key path
// Source: https://stackoverflow.com/questions/6491463/
Object.byString = function(o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
        o = o[k];
    } else {
        return;
    }
  }
  return o;
}

// Table body builder
function buildTableBody(data, columns, showHeaders, headers) {
  var body = [];

  // Inserting headers
  if(showHeaders) {
    body.push(headers);
  }
  
  // Inserting items from external data array
  data.forEach((row) => {
    var dataRow = [];
    var i = 0;
    
    columns.forEach((column) => {
      dataRow.push({text: Object.byString(row, column), alignment: headers[i].alignmentChild });
      i++;
    })
    body.push(dataRow);          
  });
  return body;
}

// Func to return generated table
export function tableReport(data, columns, witdhsDef, showHeaders, headers, layoutDef) {
  return {
    table: {
      headerRows: 1,
      widths: witdhsDef,
      body: buildTableBody(data, columns, showHeaders, headers)
    },
    layout: layoutDef,
    style: ['table']
  };
}

export default { baseApiUrl, showError, userKey }