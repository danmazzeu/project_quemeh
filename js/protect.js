document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

console.log("Elaborado e Desenvolvido por Daniel Mazzeu.");
console.log("Todos os direitos reservados " + new Date().getFullYear() + ".");

var testAd = document.createElement('div');
testAd.innerHTML = '&nbsp;';
testAd.className = 'ad-banner';
document.body.appendChild(testAd);

setTimeout(function() {
    if (testAd.offsetHeight === 0) {
        alert('Por favor, desative o AdBlock para acessar nosso site!');
    }
    testAd.remove();
}, 100);