const Calc_btn = document.getElementById('Cast_btn');
Calc_btn.addEventListener('click', function(e){

    const rand_1 = Math.floor(Math.random() * 100);
    const rand_2 = Math.floor(Math.random() * 100);
    const rand_3 = Math.floor(Math.random() * 100);
  
    $("#Compactability").text(parseFloat(rand_1).toFixed(2));
    $("#Green_Comp").text(parseFloat(rand_2).toFixed(2));
    $("#Permeability_No").text(parseFloat(rand_3).toFixed(2));

});