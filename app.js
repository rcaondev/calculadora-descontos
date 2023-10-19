let formaPagamentoTexto = '';  // Esta variável vai armazenar a forma de pagamento em texto.
let valorTotal = 0;  // Esta variável vai armazenar o valor total.

function calcularParcelas() {
    const cursoValor = parseFloat(document.getElementById('curso').value);
    const pagamentos = document.getElementsByName('pagamento');
    
    let pagamentoSelecionado;
    for(let pagamento of pagamentos) {
        if(pagamento.checked) {
            pagamentoSelecionado = pagamento.value;
            break;
        }
    }

    let desconto;
    switch (pagamentoSelecionado) {
        case 'pix':
            desconto = 0.20;
            formaPagamentoTexto = 'PIX';
            break;
        case 'cartao':
            desconto = 0.15;
            formaPagamentoTexto = 'Cartão de Crédito';
            break;
        case 'cheque':
            desconto = 0.12;
            formaPagamentoTexto = 'Cheque';
            break;
        case 'boleto':
            desconto = 0.08;
            formaPagamentoTexto = 'Boleto';
            break;
        default:
            desconto = 0;
            formaPagamentoTexto = 'Não selecionado';
            break;
    }

    const resultadoDiv = document.getElementById('resultado');
    
    if (pagamentoSelecionado === 'pix') {
        valorTotal = cursoValor - (cursoValor * desconto);
        resultadoDiv.innerHTML = `<strong>Valor Total (à vista com desconto):</strong><br>
                                  R$ ${valorTotal.toFixed(2)}`;
    } else {
        const parcelaSemDesconto = cursoValor / 6;
        const parcelaComDesconto = parcelaSemDesconto*(1-desconto);
        valorTotal = parcelaSemDesconto + (parcelaComDesconto * 5);
        resultadoDiv.innerHTML = `<strong>Parcelas:</strong><br>
                                  1ª parcela (Matrícula): R$ ${parcelaSemDesconto.toFixed(2)}<br>
                                  Demais parcelas: R$ ${parcelaComDesconto.toFixed(2)} cada`;
    }

    document.getElementById('continueBtn').style.display = 'block';
}


// ...Modal de Preenchimento para gerar PDF...

function showModal() {
    $('#dataModal').modal('show');
}

//Corrigir formato da data:

function formatarData(data) {
    const partes = data.split('-');
    if (partes.length !== 3) {
        return data; // Retorna a data original se não estiver no formato esperado
    }
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Gerar PDF após modal:

function generatePDF() {
    const nome = document.getElementById('nome').value;
    const dataNascimento = formatarData(document.getElementById('dataNascimento').value);
    const rg = document.getElementById('rg').value;
    const cpf = document.getElementById('cpf').value;
    const idAluno = document.getElementById('idAluno').value;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Proposta de Matrícula', 10, 10);
    doc.text(`Nome: ${nome}`, 10, 20);
    doc.text(`Data de Nascimento: ${dataNascimento}`, 10, 30);
    doc.text(`RG: ${rg}`, 10, 40);
    doc.text(`CPF: ${cpf}`, 10, 50);
    doc.text(`ID do Aluno: ${idAluno}`, 10, 60);
    doc.text(`Forma de Pagamento: ${formaPagamentoTexto}`, 10, 70);
    doc.text(`Valor Total: R$ ${valorTotal.toFixed(2)}`, 10, 80);

    // Para abrir o PDF no navegador ao invés de baixá-lo:
    window.open(URL.createObjectURL(doc.output('blob')));
    
    $('#dataModal').modal('hide');
}
