import { auth } from '../page-Entrada/scripts/01-auth.js';
import { authAt } from '../page-chamada/scripts/01-authAt.js'; // ✅ Import separado
import { service } from '../page-Entrada/scripts/02-service.js';
import { infoReq } from '../page-Entrada/scripts/03-infoReq.js';
import { impressao } from '../page-Entrada/scripts/04-impressao.js';
import { showError } from './config.js';

// Inicialização da aplicação
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop(); // Pega o nome do arquivo atual
    
    console.log('📍 Página atual:', currentPage);
    
    // ✅ Executa as funções baseado na página atual
    if (currentPage.includes("01-auth.html")) {
        auth(); // Executa a função auth
    }
    if (currentPage.includes("01-authAt.html")) {
        authAt(); // Executa a função authAt - INDEPENDENTE
    }
    if (currentPage.includes("02-service.html")) {
        service();
    }
    if (currentPage.includes("03-infoReq.html")) {
        infoReq();
    }
    if (currentPage.includes("04-impressao.html")) {
        impressao();
    }
    
  } catch (e) {
    console.error("Erro na inicialização:", e);
    showError("Erro ao carregar a aplicação. Recarregue a página.");
  }
});