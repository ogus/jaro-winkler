function computeDistance() {
  let str1 = document.getElementById("jaro_string_1").value;
  let str2 = document.getElementById("jaro_string_2").value;

  let result = JaroWinkler.getDistance(str1, str2);
  let str = String(Math.round(result*1000) * 0.001);
  if(str.length > 6) {
    str = str.substring(0,6);
  }

  document.getElementById("jaro_result").innerText = str;
}

window.onload = function(){
  document.getElementById("jaro_button").addEventListener("click", computeDistance);
}
