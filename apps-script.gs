/**
 * ============================================================
 *  Mentor QA — Backend do formulário (Google Apps Script)
 * ============================================================
 *
 *  O que este script faz:
 *  - Recebe as respostas enviadas pelo index.html (via POST).
 *  - Grava cada resposta como uma nova linha numa aba "Respostas".
 *  - Devolve 200 OK para o site confirmar o envio.
 *
 *  Como usar (passo a passo detalhado no README.md):
 *  1. Crie uma Planilha Google nova.
 *  2. Menu: Extensões > Apps Script.
 *  3. Apague o conteúdo padrão e cole TODO este arquivo.
 *  4. Rode uma vez a função `prepararPlanilha` (menu ▶ Executar) para
 *     criar a aba e o cabeçalho automaticamente. Autorize quando pedir.
 *  5. Implantar > Nova implantação > tipo "App da Web":
 *       - Executar como: Eu
 *       - Quem pode acessar: Qualquer pessoa
 *     Copie a URL que termina em /exec.
 *  6. Cole essa URL na constante APPS_SCRIPT_URL do index.html.
 *
 *  Nada aqui precisa ser editado — o script usa a planilha à qual está
 *  vinculado (a que você abriu no passo 2).
 * ============================================================
 */

// Código de acesso: só quem enviar este código consegue gravar.
// Passe-o apenas às pessoas que você quer que respondam.
// DEVE ser igual ao ACCESS_CODE do index.html.
var CODIGO_ACESSO = 'MENTORQA2026';

// Nome da aba onde as respostas serão gravadas.
var ABA = 'Respostas';

// Ordem das colunas. DEVE bater com a ordem gravada em `doPost`.
// (A primeira coluna, "Recebido em", é preenchida pelo servidor.)
var COLUNAS = [
  'Recebido em',
  'Nome',
  'E-mail',
  'Cliente/projeto',
  'Senioridade',
  'Stack e ferramentas',
  'Tipos de teste',
  'Responsabilidades',
  'Estudou por conta própria',
  'Feedback recente',
  'Objetivo (3 meses)',
  'Motivação',
  'Tempo disponível/semana',
  'Demanda do projeto/RH',
  'S1 documentação incompleta',
  'S2 plano de testes',
  'S3 registro de bug',
  'S4 bug crítico pagamento',
  'S5 sistema legado',
  'S6 rotina de testes (opc)',
  'S7 caso de teste (opc)',
  'S8 subir com bugs (opc)',
  'S9 comunicar bloqueio (opc)',
  'S10 melhorar time (opc)',
  'Consentimento LGPD',
  'Enviado em (cliente)'
];

/**
 * Recebe o POST do formulário e grava uma linha.
 */
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);

    // Barreira: recusa quem não enviar o código de acesso correto.
    if (String(dados.codigo || '') !== CODIGO_ACESSO) {
      return resposta_({ ok: false, erro: 'codigo_invalido' });
    }

    var aba = obterAba_();

    // Monta a linha na MESMA ordem de COLUNAS.
    var linha = [
      new Date(),                 // Recebido em (hora do servidor)
      dados.nome || '',
      dados.email || '',
      dados.cliente || '',
      dados.senioridade || '',
      dados.stack || '',
      dados.tipos_teste || '',
      dados.responsabilidades || '',
      dados.estudos || '',
      dados.feedback || '',
      dados.objetivo || '',
      dados.motivacao || '',
      dados.horas || '',
      dados.demanda || '',
      dados.situacao1 || '',
      dados.situacao3 || '',
      dados.situacao5 || '',
      dados.situacao6 || '',
      dados.situacao8 || '',
      dados.situacao2 || '',
      dados.situacao4 || '',
      dados.situacao7 || '',
      dados.situacao9 || '',
      dados.situacao10 || '',
      dados.consent || '',
      dados.timestamp || ''
    ];

    aba.appendRow(linha);
    return resposta_({ ok: true });
  } catch (err) {
    return resposta_({ ok: false, erro: String(err) });
  }
}

/**
 * Resposta a um GET (útil só para testar no navegador se o Web App está no ar).
 */
function doGet() {
  return resposta_({ ok: true, servico: 'Mentor QA', status: 'no ar' });
}

/**
 * Rode UMA VEZ manualmente para criar a aba "Respostas" e o cabeçalho.
 */
function prepararPlanilha() {
  var aba = obterAba_();
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS);
  }
  aba.getRange(1, 1, 1, COLUNAS.length)
     .setFontWeight('bold')
     .setBackground('#10B981')
     .setFontColor('#FFFFFF');
  aba.setFrozenRows(1);
}

/* ---------------- helpers internos ---------------- */

function obterAba_() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.insertSheet(ABA);
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length)
       .setFontWeight('bold')
       .setBackground('#10B981')
       .setFontColor('#FFFFFF');
    aba.setFrozenRows(1);
  }
  return aba;
}

function resposta_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
