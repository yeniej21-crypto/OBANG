import http.server
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map={**http.server.SimpleHTTPRequestHandler.extensions_map,'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8'}
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('',8766),H).serve_forever()
