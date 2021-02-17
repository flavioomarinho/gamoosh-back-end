<script>
        var cmd1;
        var comando = document.getElementById('comando');
        if(comando != null){
            comando.onclick = function () {
            cmd1 = document.getElementById('comando').value;
            console.log(cmd1);
            }
        };

	window.setTimeout(function () {
  window.location.reload()
}, 30000);

</script>