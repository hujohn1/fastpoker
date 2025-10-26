import socket
from django.http import HttpRequest, HttpResponse
from mini_django import HttpRequest, HttpResponse
import views

def receive(r: HttpRequest)-> HttpResponse:
    if str=='dj4e':
        return views.dj4e(r)
    elif str=='fail':
        return views.fail()


#Header
HOST = 'localhost'
PORT = 800
MAXLIMIT = 4

udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socket.bind((HOST, PORT))
socket.listen(MAXLIMIT)


while True:
    client_socket, client_address = udp_socket.accept()
    data = client_socket.recv(512)
    client_socket.sendall(data)
client_socket.close()