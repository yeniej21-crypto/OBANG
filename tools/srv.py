import http.server,functools,sys
class H(http.server.SimpleHTTPRequestHandler):
    def guess_type(self,path):
        t=super().guess_type(path)
        return t+'; charset=utf-8' if t.startswith(('text/','application/javascript')) else t
    def log_message(self,*a): pass
http.server.ThreadingHTTPServer(('',8766),functools.partial(H,directory=sys.argv[1])).serve_forever()
