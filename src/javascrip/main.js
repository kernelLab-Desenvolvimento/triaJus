import { auth } from '/src/javascrip/01-auth.js';
import { authAt } from '/src/javascrip/01-authAt.js';
import { service } from '/src/javascrip/02-service.js';
import { infoReq } from '/src/javascrip/03-infoReq.js';
import { impressao } from '/src/javascrip/04-impressao.js';
import { showError } from '/src/javascrip/config.js';

// Inicialização da aplicação
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop(); // Pega o nome do arquivo atual
    
    console.log('📍 Página atual:', currentPage);
    
    // ✅ Executa as funções baseado na página atual
    if (currentPage === "entrada" || currentPage.includes("01-auth.html")) {
        auth(); // Executa a função auth
    }
    if (currentPage === "atendimento" || currentPage.includes("01-authAt.html")) {
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