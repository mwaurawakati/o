(function () {
  // Fix locale before Flutter initializes
  Object.defineProperty(navigator, "language", {
    get: () => "en-US"
  });

  Object.defineProperty(navigator, "languages", {
    get: () => ["en-US"]
  });
})();


// // Override fetch
// const originalFetch = window.fetch;

// window.fetch = async function(input, init) {
//   // Send request to Tauri backend
//   const response = await window.__TAURI__.core.invoke('proxy_request', {
//     url: input,
//     method: init?.method || 'GET',
//     headers: init?.headers || {},
//     body: init?.body || null
//   });

//   // Return a Response-like object
//   return new Response(response.body, {
//     status: response.status,
//     headers: response.headers
//   });
// };

// class TauriXHR extends EventTarget {
//   constructor() {
//     super();
//     this.readyState = 0;
//     this.status = 0;
//     this.statusText = '';
//     this.responseText = '';
//     this.responseURL = '';
//     this.onreadystatechange = null;
//     this.timeout = 0; // ms
//     this.withCredentials = false;

//     this._headers = {};
//     this._method = null;
//     this._url = null;
//     this._async = true;
//     this._user = null;
//     this._password = null;
//     this._timer = null;
//   }

//   open(method, url, async = true, user = null, password = null) {
//     console.log('open', method, url);
//     this._method = method;
//     this._url = url;
//     this._async = async;
//     this._user = user;
//     this._password = password;

//     this.readyState = 1;
//     this._callOnReadyStateChange();
//     console.log('readyState', this.readyState);
//   }

//   setRequestHeader(header, value) {
//     console.log('setRequestHeader', header, value);
//     this._headers[header] = value;
//   }

//   getResponseHeader(header) {
//     console.log('getResponseHeader', header);
//     return this._responseHeaders?.[header.toLowerCase()] || null;
//   }

//   getAllResponseHeaders() {
//     console.log('getAllResponseHeaders');
//     if (!this._responseHeaders) return '';
//     return Object.entries(this._responseHeaders)
//       .map(([k, v]) => `${k}: ${v}`)
//       .join('\r\n');
//   }

//   abort() {
//     console.log('abort');
//     if (this._timer) clearTimeout(this._timer);
//     this.readyState = 0;
//     this._dispatchEvent('abort');
//   }

//   async send(body = null) {
//     console.log('send', body);
//     // this.readyState = 2;
//     // this._callOnReadyStateChange();
//     try {
//       if (this.timeout > 0) {
//         this._timer = setTimeout(() => {
//           this._dispatchEvent('timeout');
//         }, this.timeout);
//       }

//       this._dispatchEvent('loadstart');

//       const response = await window.__TAURI__.core.invoke('proxy_request', {
//         url: this._url,
//         method: this._method,
//         headers: this._headers,
//         body: body,
//         user: this._user,
//         password: this._password
//       });

//       if (this._timer) clearTimeout(this._timer);

//       this.status = response.status;
//       this.statusText = response.statusText || '';
//       this.responseText = response.body;
//       this._responseHeaders = Object.fromEntries(
//         Object.entries(response.headers || {}).map(([k, v]) => [k.toLowerCase(), v])
//       );
//       this.readyState = 4;

//       this._dispatchEvent('load');
//       this._dispatchEvent('loadend');
//       this._callOnReadyStateChange();
//     } catch (err) {
//       this._dispatchEvent('error');
//       this._dispatchEvent('loadend');
//       this._callOnReadyStateChange();
//       console.error('TauriXHR error', err);
//     }
//   }

//   // internal helpers
//   _dispatchEvent(name) {
//     console.log('dispatchEvent', name);
//     const evt = new Event(name);
//     this.dispatchEvent(evt);
//   }

//   _callOnReadyStateChange() {
//     console.log('callOnReadyStateChange', this.readyState);
//     if (typeof this.onreadystatechange === 'function') {
//       this.onreadystatechange();
//     }
//   }
// }

// // Override the global XHR
// window.XMLHttpRequest = TauriXHR;


