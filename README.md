# PopupEditor Plugin

**PopupEditor** é um plugin JavaScript leve projetado para transformar qualquer elemento HTML em um campo editável com uma interface popup elegante e flutuante. 

Diferente de editores *inline* tradicionais, o PopupEditor utiliza um sistema de **posicionamento inteligente** para garantir que o formulário de edição esteja sempre visível e nunca seja cortado por containers com `overflow: hidden`. Ele foi perfeitamente ajustado para projetos que utilizam **Bootstrap 4**, mas funciona de forma impecável como uma ferramenta **Vanilla JS** independente.

## Principais Características

-   **🚀 Zero Dependências (Opcional)**: Funciona com JavaScript puro, mas integra-se perfeitamente se você já usa jQuery.
-   **🧠 Posicionamento Inteligente**: O popup detecta as bordas da janela e se move automaticamente para cima, baixo, esquerda ou direita para permanecer visível.
-   **🛡️ À Prova de Overflow**: Ao ser anexado ao `body` com `position: fixed`, ele ignora restrições de `overflow: hidden` de elementos pais.
-   **🎨 Totalmente Customizável**: Você define o HTML do formulário através de uma função `render` poderosa que tem acesso ao elemento original e atributos `data-*`.
-   **⚡ Pronto para AJAX**: Inclui estados de *loading*, animações de sucesso e tratamento de erros integrados na API.
-   **📱 Responsivo**: Ajusta-se dinamicamente ao redimensionar a tela ou ao rolar a página.
-   **Compatível com Modais**: Configurado para sobrepor modais do Bootstrap (z-index 1060).
-   **Estado Vazio Customizável**: Permite definir HTML customizado para quando o campo não possui valor.
-   **Estilização Flexível**: Opção para usar estilos padrão ou remover tudo para customização total.

## Instalação

Basta incluir o arquivo `popup-editor.js` no seu projeto:

```html
<script src="path/to/popup-editor.js"></script>
```

## Como Usar

### Via jQuery (Recomendado)

```javascript
$('#meu-elemento').popupEditor({
  render: function(val, close, el) {
    // val: valor atual do elemento
    // close: função para fechar o popup manualmente
    // el: o elemento DOM que disparou o popup
    return `<input type="text" id="input-edit" class="form-control" value="${val}">`;
  },
  onSave: function(el, api) {
    const novoValor = $('#input-edit').val();
    
    api.setLoading(true); // Ativa spinner
    
    // Simulação AJAX
    setTimeout(() => {
      $(el).text(novoValor);
      api.setLoading(false);
      api.close(); // Fecha manualmente
    }, 1000);
  }
});
```

### Via Vanilla JS

```javascript
new PopupEditor(document.getElementById('meu-elemento'), {
  render: (val) => `<input type="text" value="${val}">`,
  onSave: (el, api) => {
    el.innerText = "Novo Valor";
    api.close();
  }
});
```

## Opções do Plugin

| Parâmetro | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `render` | `function` | - | **Obrigatório**. Retorna o HTML do formulário. Recebe `(valorAtual, closeFunc, elemento)`. |
| `onSave` | `function` | - | Chamado ao clicar em Salvar. Recebe `(elemento, api)`. |
| `onCancel` | `function` | - | Chamado ao clicar em Cancelar ou fora do popup. |
| `saveLabel` | `string` | `"Salvar"` | Texto do botão de salvar. |
| `cancelLabel` | `string` | `"Cancelar"` | Texto do botão de cancelar. |
| `zIndex` | `number` | `1060` | Z-index do popup. |
| `emptyContent` | `string` | `null` | HTML customizado para o estado vazio. |
| `noStyle` | `boolean` | `false` | Se `true`, remove o estilo padrão (azul e sublinhado). |

## Métodos da API (dentro do onSave)

-   `api.close()`: Fecha o popup imediatamente.
-   `api.success()`: Exibe animação de sucesso (ícone de check + pulso) e fecha após 600ms.
-   `api.showError(mensagem)`: Exibe uma mensagem de erro no topo do popup.
-   `api.hideError()`: Esconde a mensagem de erro.
-   `api.setLoading(true/false)`: Ativa/desativa o estado de carregamento (spinner e botões).

## Licença

MIT
