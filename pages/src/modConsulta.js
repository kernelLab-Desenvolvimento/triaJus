/* Modulo de consulta automatica CPF
** site: situacao-cadastral.com.br
** metodo: print de tela
*/

const puppeteer = require('puppeteer');
let cpf = '04438487269';

const consultaCPF = async (cpfconsultado) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.situacao-cadastral.com/');
    console.log("aguardando a pagina");
    await page.waitForSelector('#doc');
    console.log(cpfconsultado);
    await page.type('#doc', cpfconsultado);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#corpo > tbody > tr:nth-child(2) > td > span > a');
    await page.screenshot({path:`${cpf}.png`});

};

consultaCPF(cpf);
