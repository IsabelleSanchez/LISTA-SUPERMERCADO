document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('itemInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const shoppingList = document.getElementById('shoppingList');
    const clearListBtn = document.getElementById('clearListBtn');
     const themeToggleBtn = document.getElementById('themeToggleBtn'); // Novo: Botão de alternar tema
    // Primeiro ouvinte de evento, é aplicado em toda página web


    // Função para carregar itens do Local Storage
    function loadItems() {
        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.forEach(item => {
            addItemToDOM(item.text, item.completed);
        });
    }

    // Função que salva os itens no Local Storage
    function saveItems() {
        const items = [];
        shoppingList.querySelectorAll('li').forEach(li => {
            items.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }

    // Função para adicionar um item ao DOM (à lista na página)
    function addItemToDOM(text, completed = false) {
        const listItem = document.createElement('li');
        // Adiciona classes Bootstrap para item de lista
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        const itemText = document.createElement('span');
        itemText.textContent = text;
        
        if (completed) {
            listItem.classList.add('completed');
        }

        // Marcar/desmarcar item ao clicar no texto
        // Segundo ouvinte de evento
        itemText.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            saveItems(); // Salva a mudança de status
        });

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('item-actions'); // Pode ser útil para agrupar botões

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Apagar';
        // Adiciona classes Bootstrap para o botão de apagar
        // Terceiro ouvinte de evento 
        deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm'); 
        deleteBtn.addEventListener('click', () => {
            shoppingList.removeChild(listItem);
            saveItems(); // Salva a remoção
        });

        listItem.appendChild(itemText);
        actionsDiv.appendChild(deleteBtn);
        listItem.appendChild(actionsDiv);
        shoppingList.appendChild(listItem);
    }

    // Evento para adicionar item ao clicar no botão
    // Quarto ouvinte de evento
    addItemBtn.addEventListener('click', () => {
        const itemText = itemInput.value.trim();
        if (itemText !== '') {
            addItemToDOM(itemText);
            saveItems(); // Salva o novo item
            itemInput.value = ''; // Limpa o campo de input
            itemInput.focus(); // Retorna o foco para o campo
        }
    });

    // Evento para adicionar item ao pressionar Enter no campo de input
    // Quinto ouvinte de evento
    itemInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addItemBtn.click(); // Simula o clique no botão de adicionar
        }
    });

    // Evento para limpar toda a lista
    // Sexto ouvinte de evento
    clearListBtn.addEventListener('click', () => {
        // Usa o modal de confirmação nativo do navegador
        if (confirm('Tem certeza que deseja limpar toda a lista?')) {
            shoppingList.innerHTML = ''; // Remove todos os itens do DOM
            localStorage.removeItem('shoppingList'); // Remove do Local Storage
        }
    });

    // Carrega os itens quando a página é carregada
    loadItems();

    // --- Nova lógica para o Tema Escuro ---

    // Função para aplicar o tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggleBtn.textContent = 'Alternar para Tema Claro';
            themeToggleBtn.classList.remove('btn-secondary');
            themeToggleBtn.classList.add('btn-primary'); // Pode ser útil para destaque no modo escuro
        } else {
            document.body.classList.remove('dark-mode');
            themeToggleBtn.textContent = 'Alternar para Tema Escuro';
            themeToggleBtn.classList.remove('btn-primary');
            themeToggleBtn.classList.add('btn-secondary'); // Volta ao estilo padrão do Bootstrap
        }
        localStorage.setItem('theme', theme); // Salva a preferência
    }

    // Carrega a preferência de tema do Local Storage ou do sistema operacional
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Se não há preferência salva, verifica a preferência do sistema operacional
            applyTheme('dark');
        } else {
            // Padrão para tema claro
            applyTheme('light');
        }
    }

    // Evento para alternar o tema ao clicar no botão
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

     // Carrega o tema ao iniciar a página
    loadTheme();
});