// Seleção de elementos
const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('select');
const perguntaInput = document.getElementById('pergunta');
const enviarBtn = document.getElementById('send');
const form = document.getElementById('form');
const respostaDiv = document.getElementById('resposta');
const responseContent = document.querySelector('.responce-content');

// Configuração do Markdown
const converter = new showdown.Converter();

// Função para formatar a resposta em HTML
const formatarResposta = (text) => {
    return converter.makeHtml(text);
};

// Função para fazer a requisição à API Gemini
const perguntarIA = async (pergunta, jogo, apiKey) => {
    const model = "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const prompt = `Você é um especialista no jogo ${jogo}. Responda de forma concisa (máx. 500 caracteres) em markdown:
    
    **Pergunta:** ${pergunta}
    
    **Regras:**
    - Data atual: ${new Date().toLocaleDateString()}
    - Se não souber, responda "Não sei"
    - Se for off-topic, responda "Pergunta não relacionada ao jogo"
    - Seja objetivo e use markdown para formatação`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Erro na requisição:', error);
        return "**Erro:** Não foi possível processar sua pergunta. Verifique sua API Key e conexão.";
    }
};

// Função principal para enviar o formulário
const enviarFormulario = async (event) => {
    // Previne o comportamento padrão do formulário
    event.preventDefault();
    
    // Obtém os valores dos campos
    const apiKey = apiKeyInput.value.trim();
    const jogo = gameSelect.value;
    const pergunta = perguntaInput.value.trim();

    // Validação dos campos
    if (!apiKey || !jogo || !pergunta) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    // Configura estado de carregamento
    enviarBtn.disabled = true;
    enviarBtn.textContent = 'Processando...';
    enviarBtn.classList.add('loading');
    respostaDiv.classList.add('hidden');

    try {
        // Chama a API
        const respostaIA = await perguntarIA(pergunta, jogo, apiKey);
        
        // Exibe a resposta formatada
        responseContent.innerHTML = formatarResposta(respostaIA);
        respostaDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Erro:', error);
        responseContent.innerHTML = formatarResposta("**Erro:** Ocorreu um problema ao processar sua pergunta.");
        respostaDiv.classList.remove('hidden');
    } finally {
        // Restaura o estado normal do botão
        enviarBtn.disabled = false;
        enviarBtn.textContent = 'Perguntar';
        enviarBtn.classList.remove('loading');
    }
};

// Adiciona o event listener ao formulário
form.addEventListener('submit', enviarFormulario);

// Verificação de carregamento (para debug)
console.log("Script carregado com sucesso!");