document.addEventListener('DOMContentLoaded', () => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [
        { id: 'concerto-rock', nome: 'Concerto de Rock da Banda XYZ', data: '15/08/2025', preco: 80.00, imagem: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Rock' },
        { id: 'teatro-comedia', nome: 'Peça de Comédia: Risadas Garantidas', data: '22/09/2025', preco: 50.00, imagem: 'https://via.placeholder.com/150/00FF00/FFFFFF?Text=Teatro' },
        { id: 'festival-gastronomico', nome: 'Festival Gastronômico da Cidade', data: '01/10/2025', preco: 35.00, imagem: 'https://via.placeholder.com/150/0000FF/FFFFFF?Text=Comida' },
    ];

    const listaEventosDiv = document.getElementById('lista-eventos');
    // Mudamos a referência para a div dentro do modal
    const listaMeusIngressosDivModal = document.getElementById('lista-meus-ingressos-modal');
    const semIngressosMensagemModal = document.getElementById('sem-ingressos-mensagem-modal'); // Referência para a mensagem dentro do modal

    const formCriarEvento = document.getElementById('form-criar-evento');
    const nomeEventoInput = document.getElementById('nome-evento');
    const dataEventoInput = document.getElementById('data-evento');
    const precoEventoInput = document.getElementById('preco-evento');
    const imagemEventoInput = document.getElementById('imagem-evento');

    // Referência ao modal (para carregar os ingressos sempre que ele for exibido)
    const meusIngressosModal = document.getElementById('meusIngressosModal');

    // Função para salvar os eventos no localStorage
    function salvarEventos() {
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }

    // Função para criar um ID único
    function gerarIdUnico() {
        return Math.random().toString(36).substring(2, 15);
    }

    // Função para carregar os eventos na página
    function carregarEventos() {
        listaEventosDiv.innerHTML = '';
        eventos.forEach(evento => {
            const eventoCard = document.createElement('div');
            eventoCard.classList.add('col-md-6', 'col-lg-4', 'mb-4');
            eventoCard.innerHTML = `
                <div class="card evento-card h-100 shadow-sm">
                    <img src="${evento.imagem}" class="card-img-top" alt="${evento.nome}" style="max-height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h3 class="card-title text-primary">${evento.nome}</h3>
                        <p class="card-text"><strong>Data:</strong> ${evento.data}</p>
                        <p class="card-text"><strong>Preço:</strong> R$ ${evento.preco.toFixed(2)}</p>
                        <div class="d-flex align-items-center mt-3 compra-area">
                            <input type="number" id="qtd-${evento.id}" value="1" min="1" max="10" class="form-control me-2 w-auto">
                            <button class="btn btn-success" data-id="${evento.id}">Comprar</button>
                        </div>
                    </div>
                </div>
            `;
            listaEventosDiv.appendChild(eventoCard);
        });

        document.querySelectorAll('.evento-card button').forEach(button => {
            button.addEventListener('click', (event) => {
                const eventoId = event.target.dataset.id;
                const quantidadeInput = document.getElementById(`qtd-${eventoId}`);
                const quantidade = parseInt(quantidadeInput.value);
                comprarIngresso(eventoId, quantidade);
            });
        });
    }

    // Event listener para o formulário de criação de eventos
    formCriarEvento.addEventListener('submit', (event) => {
        event.preventDefault();
        const nome = nomeEventoInput.value.trim();
        const data = dataEventoInput.value;
        const preco = parseFloat(precoEventoInput.value);
        const imagem = imagemEventoInput.value.trim();

        if (nome && data && !isNaN(preco)) {
            const novoEvento = {
                id: gerarIdUnico(),
                nome: nome,
                data: data,
                preco: preco,
                imagem: imagem || 'https://via.placeholder.com/150/cccccc/000000?Text=Sem+Imagem' // Imagem padrão se não for fornecida
            };
            eventos.push(novoEvento);
            salvarEventos();
            carregarEventos();
            formCriarEvento.reset(); // Limpa o formulário
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });

    // Função para comprar ingresso
    function comprarIngresso(eventoId, quantidade) {
        const eventoSelecionado = eventos.find(e => e.id === eventoId);
        if (!eventoSelecionado || quantidade <= 0) {
            alert('Por favor, selecione um evento válido e uma quantidade maior que zero.');
            return;
        }

        let meusIngressos = JSON.parse(localStorage.getItem('meusIngressos')) || [];

        const ingressoExistente = meusIngressos.find(item => item.id === eventoId);

        if (ingressoExistente) {
            ingressoExistente.quantidade += quantidade;
        } else {
            meusIngressos.push({
                id: eventoSelecionado.id,
                nome: eventoSelecionado.nome,
                data: eventoSelecionado.data,
                precoUnitario: eventoSelecionado.preco,
                quantidade: quantidade
            });
        }

        localStorage.setItem('meusIngressos', JSON.stringify(meusIngressos));
        alert(`${quantidade} ingresso(s) para "${eventoSelecionado.nome}" adicionado(s) aos seus ingressos!`);
        // Não chamamos carregarMeusIngressos() aqui diretamente.
        // Ele será chamado quando o modal for aberto.
    }

    // Função para carregar e exibir os ingressos comprados (agora direcionada para o modal)
    function carregarMeusIngressosNoModal() {
        let meusIngressos = JSON.parse(localStorage.getItem('meusIngressos')) || [];
        listaMeusIngressosDivModal.innerHTML = ''; // Limpa a lista antes de adicionar

        if (meusIngressos.length === 0) {
            semIngressosMensagemModal.style.display = 'block';
        } else {
            semIngressosMensagemModal.style.display = 'none';
            meusIngressos.forEach(ingresso => {
                const ingressoItem = document.createElement('div');
                ingressoItem.classList.add('card', 'meu-ingresso-item', 'mb-3', 'shadow-sm');
                const total = (ingresso.quantidade * ingresso.precoUnitario).toFixed(2);
                ingressoItem.innerHTML = `
                    <div class="card-body">
                        <p class="card-text"><strong>Evento:</strong> ${ingresso.nome}</p>
                        <p class="card-text"><strong>Data:</strong> ${ingresso.data}</p>
                        <p class="card-text"><strong>Quantidade:</strong> ${ingresso.quantidade}</p>
                        <p class="card-text"><strong>Preço Unitário:</strong> R$ ${ingresso.precoUnitario.toFixed(2)}</p>
                        <p class="card-text fw-bold"><strong>Total:</strong> R$ ${total}</p>
                    </div>
                `;
                listaMeusIngressosDivModal.appendChild(ingressoItem);
            });
        }
    }

    // Event listener para o modal. Quando o modal de Meus Ingressos for mostrado, ele recarrega a lista.
    meusIngressosModal.addEventListener('show.bs.modal', carregarMeusIngressosNoModal);


    // Inicializa a aplicação
    const eventosSalvos = localStorage.getItem('eventos');
    if (eventosSalvos) {
        eventos.length = 0; // Limpa o array inicial
        eventos.push(...JSON.parse(eventosSalvos));
    }
    carregarEventos();
    // A função carregarMeusIngressosNoModal não é chamada na inicialização aqui,
    // pois ela será chamada automaticamente quando o modal for aberto pela primeira vez.
});