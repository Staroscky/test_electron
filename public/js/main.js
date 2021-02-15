
// When the DOM is ready
document.addEventListener("DOMContentLoaded", function(event) {
  var peer_id;
  var username;
  var conn;
  var room;
  var local_peer_id;
  var remote_peer_id;

  var localuser;
  var local_video = false;
  

  //---------------------------------------- REFERENTE A FN QUE SAO CHAMADAS NO HTML E REQUEST DE VIDEO ---------------------------------//
  const callbacks = {
    success: function(stream){
      window.localStream = stream;
      onReceiveStream(stream, 'localVideo');
      if(local_video == true){
        video()
      }
      local_video = true;
    },
    error: function(err){
      console.error(err);
    }
  }; 
  requestLocalVideo();  
  /**
   * Starts the request of the camera and microphone
   *
   * @param {Object} callbacks
   */
  function requestLocalVideo() {
    // Monkeypatch for crossbrowser geusermedia
    //navigator.mediaDevices.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    // Request audio an video
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video:{ 
        width: { max: 1280 },
        height: { max: 720 }
      },
      // {
      //   // 720p
      //   width: { max: 1280 },
      //   height: { max: 720 }
      //   // 480p
      //   width: { max: 427 },
      //   height: { max: 240 }
      // } 
    }).then(callbacks.success).catch(callbacks.error);
  }

  /**
   * Handle the providen stream (video and audio) to the desired video element
   *
   * @param {*} stream
   * @param {*} element_id
   */
  function onReceiveStream(stream, element_id) {
    // Retrieve the video element according to the desired
    var video = document.getElementById(element_id);
    // Set the given stream as the video source
    video.srcObject = stream;

    // Store a global reference of the stream
    window.peer_stream = stream;
    if(element_id == "localVideo"){
      document.getElementById("localimg").style.display = "none"
      document.getElementById("localVideo").style.display = "block"
      
    }else{
      document.getElementById("remoteimg").style.display = "none"
      document.getElementById("remoteVideo").style.display = "block"
    }
  }

  /**
   * Appends the received and sent message to the listview
   *
   * @param {Object} data
   */


  /**
   *  Request a videocall the other user
   */
  async function video(){

    var call = await peer.call(conn.peer, window.localStream);
    call.on('stream', function (stream) {
      window.peer_stream = stream;
      onReceiveStream(stream, 'remoteVideo');
    });
    call.on('error', (e) => {
        console.log(e);
        console.log("error call on")
    });
  }
  
  //-----------------------------------------------------------------------   PEER   ---------------------------------------//
  var peer = new Peer(document.getElementById("local_peer_id").value,{
      host: "web.warusky.com.br",
      port: 12003,
      path: '/peerjs',
      debug: 0,
      config: {
        'iceServers': [
            {
                url:'stun:stun.l.google.com:19302'
            },
            {
                url: 'turn:turn.dsix.com.br',
                credential: 'matheus',
                username: 'matheus'
            }
        ]
      }
  });
  
  // Once the initialization succeeds:
  // Show the ID that allows other user to connect to your session.
  peer.on('open', function () {
    document.getElementById("local_peer_id").value = peer.id;
    local_peer_id = peer.id;
  });

  // When someone connects to your session:
  //
  // 1. Hide the peer_id field of the connection form and set automatically its value
  // as the peer of the user that requested the connection.
  // 2.
  peer.on('connection', function (connection) {
    conn = connection;
    peer_id = connection.peer;

    // Hide peer_id field and set the incoming peer id as value
    document.getElementById("remote_peer_id").value = peer_id;
    $('#chat').append(`<span class="msg_acao">${connection.metadata.username} entrou na sala</spna></br>`);
    document.getElementById("nomeRemote").textContent = connection.metadata.username;
    if(document.getElementById("modal_carregando")){
      document.getElementById("modal_carregando").style.display = "none";
    }
  });

  

  /**
   * Handle the on receive call event
   */
  peer.on('call',async function (call) {
        // Answer the call with your own video/audio stream
        call.answer(window.localStream);

        // Receive data
        call.on('stream', function (stream) {
            // Store a global reference of the other user stream
            window.peer_stream = stream;
            // Display the stream of the other user in the remoteVideo video element !
            onReceiveStream(stream, 'remoteVideo');
        });

  });

  peer.on('disconnected', () => {
    $('#chat').append(`<span class='msg_acao'>${conn.metadata.username} foi desconectado</spna></br>`);
    document.getElementById("remoteimg").style.display = "block"
    document.getElementById("remoteVideo").style.display = "none"
    peer.reconnect();
    video()
  });

  peer.on('close', function() { 
    document.getElementById("remoteimg").style.display = "block"
    document.getElementById("remoteVideo").style.display = "none"
    peer.disconnect();
    $('#chat').append(`<span class='msg_acao'>${conn.metadata.username} saiu da sala</spna></br>`);

  })

  peer.on('error', function(err){
    document.getElementById("remoteimg").style.display = "block"
    document.getElementById("remoteVideo").style.display = "none"
    $('#chat').append(`<span class='msg_acao'>${conn.metadata.username} saiu da sala</spna></br>`);
    peer.reconnect();
    video()
  });
  
  //-------------------------------------------------------------- SOCKETS ---------------------------------------------------------------//
  createConnection()
  function createConnection() {
    localuser = document.getElementById("local_peer_id").dataset.usuario;
    room = document.getElementById("sala").value;
    if (room !== '') {
      peer_id = document.getElementById("local_peer_id").value;
      data = {room, peer_id}
      socket.emit('create or join', JSON.stringify(data));
    }

    socket.on('chat', function(message) {
      $('#chat').append("<div class='msg_recebida'><p>" + message.msg + "</p></div></br>");
      document.getElementById("chat").scrollTo(0,document.getElementById("chat").scrollHeight);
    });
    
    
    $('#msg').keypress(function(e) { // text written
    
    
      if (e.keyCode === 13) {
        if ($('#msg').val() === '')
          return false;
        var msg = $('#msg').val();
        var msgob = {
          'user': localuser,
          'msg': msg
        };
        socket.emit('chat', msgob);
        $('#chat').append("<div class='msg_enviada'><p>" + msgob.msg + "</p></div></br>");
        document.getElementById("chat").scrollTo(0,document.getElementById("chat").scrollHeight);
        $('#msg').val('');
      }
    });
    
    socket.on('created', function(room) {
    });
    
    socket.on('join', function(room) {
    });
    
    socket.on('joined', function(room) {
    });
    
    socket.on('creatPeer', function(p_remote_peer_id){
      document.getElementById("remote_peer_id").value = p_remote_peer_id;
      remote_peer_id = p_remote_peer_id;
      username = document.getElementById("local_peer_id").dataset.nome;
      if (peer_id) {
          conn = peer.connect(remote_peer_id, {
              metadata: {
                  'username': username
              }
          });
          socket.emit('creatPeer2-to-server', local_peer_id);
      }else{
          return false;
      }

    });
    
    socket.on('creatPeer2', function(p_remote_peer_id){
      document.getElementById("remote_peer_id").value = p_remote_peer_id;
      username = document.getElementById("local_peer_id").dataset.nome;
      if (p_remote_peer_id) {
          conn = peer.connect(p_remote_peer_id, {
              metadata: {
                  'username': username
              }
          });
          if(local_video == true){
            video()
          }
          local_video = true;
      }else{
          return false;
      }

    });

    socket.on('encerrar_atendimento', function(){
      console.log("encerrou")
      window.location.href = "/?alert=true";
    });
    
    socket.on('finaliza_pedido', async function(negociacao){
      await fetch('/att_pedido', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({"negociacao" : negociacao.negociacao})
        }
      ).then((response)=>{
          response.json().then((resposta)=>{
              document.getElementById("historico_tab").click();
              document.getElementById("n_pedido").textContent = resposta.id_pedidos;
          })
      })
      document.querySelectorAll("#dados_gerais input[type='text']").forEach((input)=>{
          input.value = "";
      })
      document.querySelectorAll("#dados_gerais textarea").forEach((textarea)=>{
          textarea.value = "";
      })
      document.getElementById("itens_pedido_tab").click();
    });

    socket.on('sincroniza_comprador', async function(data){
      data = JSON.parse(data);
      
      switch (data.id) {
        case "fin_desconto":
            document.getElementById(`${data.id}`).value = data.value
            calcular_finalizacao();
          break;

        case "fin_frete":
            document.querySelectorAll("input[name='fin_frete']").forEach((input)=>{
              if(input.value == data.value){
                input.checked = "true";
              }
            })
          break;
        
        case "grupo_compradores": 
            document.getElementById(data.id).value = data.comprador.trim(" ");
            document.getElementById("comprador_atual").textContent = data.comprador;
          break;

        default:
            document.getElementById(`${data.id}`).value = data.value
          break;
      }
      
      
    });

    socket.on('sincroniza_vitrine', async function(data){
      console.log(data);
      if(data.acao == "insert"){
        document.querySelector(`.container-image-vitrine div[data-id_produtos='${data.id_produtos}']`).classList = "div-selecionado produto-selecionado";
        document.querySelector(`.container-image-vitrine div[data-id_produtos='${data.id_produtos}']`).children[1].textContent = "SELECIONADO";
        document.querySelector(`.container-image-vitrine div[data-id_produtos='${data.id_produtos}']`).children[0].checked = true;
      }else{
        document.querySelector(`.container-image-vitrine div[data-id_produtos='${data.id_produtos}']`).classList = "div-selecionado";
        document.querySelector(`.container-image-vitrine div[data-id_produtos='${data.id_produtos}']`).children[1].textContent = "COMPRAR";
        document.querySelector(`.container-image-vitrine div[data-id_produtos='${data.id_produtos}']`).children[0].checked = false;
      }
      pega_corpo_pedido(0);
    });
    
    socket.on('sincroniza_itens_pedidos', async function(data){
      data = JSON.parse(data);
      let item_pedido = document.getElementById(`PG${data.id_produtos_grades}`)
      if(item_pedido){
        item_pedido.value = data.valor;
        calcular();
      }
    });
    
    socket.on('sincroniza_itens_pedidos_cabecalho', async function(data){
      data = JSON.parse(data);

      let item = document.getElementById(`${data.id_item}`)
      if(item){
        item.value = data.valor;
        calcular();
      }

    })

    socket.on('att_itens_pedido', function(){
      //$("#pedido_tab").tab('show');
      document.getElementById("itens_pedido_tab").click();
    })
    
    socket.on('pega_finalizacao', function(data){
      let tab_pedido = document.getElementById("pedido_tab");
      if(tab_pedido && !!(tab_pedido.className.split(" ").indexOf("active") + 1) ){
        pega_finalizacao(0);
        $('#nav_tab_secundario a[href="#dados_gerais"]').tab('show');
      }
    })

    socket.on('abre_item_pedido', function(data){
      data = JSON.parse(data);

      let tab_pedido = document.getElementById("pedido_tab");
      if(tab_pedido && !!(tab_pedido.className.split(" ").indexOf("active") + 1) ){
        abre_item_ped(data.id_produtos, data.valor, 0);
      }
    })

    socket.on('cancela_pedido', async function(){
      document.getElementById('historico_tab').click();
    })

    
  }

}, false);//