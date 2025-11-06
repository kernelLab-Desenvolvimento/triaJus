/*configurações globais */
const getSimpleIP = () => {
  return window.location.hostname;
};

export const API_BASE_URL = `http://${getSimpleIP()}:3001/api`;

// ✅ NOVO: Configuração WebSocket
export const WEBSOCKET_URL = `ws://${getSimpleIP()}:8080`;

/*funções para data e hora */
export function dataAtual() {
  const data = new Date();
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}

export function horaAtual() {
  const agora = new Date();
  return `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
}

/*Caixa de erro personalizada */
export function showError(message) {
  const errorElement = document.getElementById('error-message') || createErrorMessageElement();
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => errorElement.style.display = 'none', 5000);
}

function createErrorMessageElement() {
  const div = document.createElement('div');
  div.id = 'error-message';
  div.style = `position: fixed;
              top: 20px;
              right: 20px;
              padding: 15px;
              background: #ff4444;
              color: white;
              border-radius: 5px;
              display: none;
              z-index: 1000;`;
  document.body.appendChild(div);
  return div;
}

export async function fetchAPI(endpoint, method, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Só adiciona body se existir dados e method não for GET/HEAD
  if (data && !['GET', 'HEAD'].includes(method.toUpperCase())) {
    options.body = JSON.stringify(data);
  }

  try {
    console.log("Chamada API:", `${API_BASE_URL}/${endpoint}`, options);
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    
    if (!response.ok) {
      let errorMessage = `Erro HTTP: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Se não conseguir parsear JSON, usa a mensagem padrão
      }
      
      throw new Error(errorMessage);
    }

    // Para respostas sem conteúdo (ex: 204 No Content)
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na chamada API:', error);
    throw error;
  }
}