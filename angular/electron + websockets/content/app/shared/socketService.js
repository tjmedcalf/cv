angular.module('AKMU01A1.shared').factory('SocketService', ['socketFactory', 
	function (socketFactory) {
  		var myIoSocket = io.connect('localhost:8080');

  		mySocket = socketFactory({
			ioSocket: myIoSocket
		});

		return mySocket;
	}
]);