import http.server,functools,sys
class H(http.server.SimpleHTTPRequestHandler):
    extensions_map={**http.server.SimpleHTTPRequestHandler.extensions_map,'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'}
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('',8812),functools.partial(H,directory=sys.argv[1])).serve_forever()
