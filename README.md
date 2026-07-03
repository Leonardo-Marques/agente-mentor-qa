# Mentor QA — Formulário de Check-in de Carreira

Site estático (uma página) que aplica o questionário do **Mentor QA**: perfil, objetivos e situações do dia a dia de um QA. As respostas são gravadas numa **Planilha Google** e o respondente ainda recebe um **resumo copiável** das próprias respostas. Depois, você roda o agente Mentor QA sobre cada resposta para gerar o **PDI (Plano de Desenvolvimento Individual) de 3 meses**, individualmente.

```
Respondente → formulário (GitHub Pages)
                  │  envia →  Google Apps Script  →  Planilha Google
                  ▼
             resumo copiável (rede de segurança)
                  ▼
     você roda o agente → PDI individual
```

## Arquivos

| Arquivo | O que é |
|--------|---------|
| `index.html` | O formulário completo. HTML puro, sem dependências (só fontes do Google). É o que vai para o GitHub Pages. |
| `apps-script.gs` | O código que recebe as respostas e grava na planilha. Você cola no Google Apps Script. |
| `.nojekyll` | Arquivo vazio que impede o GitHub Pages de processar o site com Jekyll. Não mexa. |
| `README.md` | Este guia. |

---

## Parte 1 — Conectar ao Google (fazer uma vez)

O site precisa de um lugar para gravar as respostas. Usamos Google Apps Script (**gratuito**, já vem na sua conta Google).

### 1.1 — Criar a planilha
1. Acesse [sheets.new](https://sheets.new) para criar uma Planilha Google em branco.
2. Dê um nome a ela (ex.: **"Mentor QA — Respostas"**).

### 1.2 — Colar o script
1. Na planilha, menu **Extensões → Apps Script**.
2. Apague qualquer código que aparecer no editor.
3. Abra o arquivo `apps-script.gs` deste repositório, **copie tudo** e cole no editor.
4. Clique no disquete (**Salvar projeto**).

### 1.3 — Preparar a planilha (cria o cabeçalho sozinho)
1. No editor do Apps Script, na barra de cima, selecione a função **`prepararPlanilha`** na lista.
2. Clique em **▶ Executar**.
3. O Google vai pedir autorização na primeira vez:
   - **Revisar permissões → escolha sua conta → Avançado → Acessar (nome do projeto) → Permitir.**
   - (É seguro: o script só mexe na sua própria planilha.)
4. Volte na planilha: a aba **"Respostas"** foi criada com o cabeçalho em verde.

### 1.4 — Publicar como aplicativo web
1. No editor do Apps Script, canto superior direito: **Implantar → Nova implantação**.
2. Clique na engrenagem ⚙ ao lado de "Selecionar tipo" e escolha **App da Web**.
3. Preencha:
   - **Descrição:** qualquer coisa (ex.: "v1").
   - **Executar como:** **Eu** (seu e-mail).
   - **Quem pode acessar:** **Qualquer pessoa**.
     > ⚠️ Precisa ser "Qualquer pessoa" — senão o formulário no navegador do respondente não consegue enviar. O script só *grava*; ninguém vê a planilha por isso.
4. Clique em **Implantar**. Autorize de novo se pedir.
5. Copie a **URL do app da Web** — ela termina em **`/exec`**. Guarde.

### 1.5 — Colar a URL no formulário
1. Abra o `index.html` num editor de texto.
2. Perto do fim do arquivo, procure a linha:
   ```js
   var APPS_SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
   ```
3. Troque o `COLE_AQUI_A_URL_DO_APPS_SCRIPT` pela URL que termina em `/exec`. Exemplo:
   ```js
   var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfyc.../exec";
   ```
4. Salve.

> **Enquanto você não colar a URL,** o formulário ainda funciona: ele mostra o resumo copiável e não tenta enviar (modo "ainda não conectado"). Assim nada quebra nos testes.

---

## Parte 2 — Publicar no GitHub Pages (fazer uma vez)

### 2.1 — Subir os arquivos
Suba `index.html`, `apps-script.gs`, `.nojekyll` e `README.md` para o repositório `agente-mentor-qa`, na branch `main` (raiz).

Se for pela linha de comando:
```bash
git add index.html apps-script.gs .nojekyll README.md
git commit -m "Formulário Mentor QA"
git push origin main
```

### 2.2 — Ligar o Pages
1. No GitHub, abra o repositório → **Settings → Pages**.
2. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
3. Em **Branch**, selecione **`main`** e a pasta **`/ (root)`**. Clique em **Save**.
4. Aguarde ~1 minuto. A página aparece em:
   ```
   https://leonardo-marques.github.io/agente-mentor-qa/
   ```

### 2.3 — Testar de ponta a ponta
1. Abra o link acima.
2. Preencha e envie um teste.
3. Confira: apareceu uma nova linha na aba **"Respostas"** da sua planilha? Se sim, está tudo ligado. 🎉

---

## Como gerar o PDI depois

1. Abra a planilha e copie a linha (ou as respostas) da pessoa.
2. Rode o agente **Mentor QA v4.0** (arquivo `agente-com-ancora-v4.md`) com essas respostas como entrada.
3. Devolva o PDI gerado à pessoa individualmente.

> As respostas coletadas cobrem o perfil (Bloco A), os objetivos (Bloco B) e o check-in de situações (5 obrigatórias + até 5 opcionais). O agente usa isso para diagnosticar a senioridade e montar o plano.

---

## Perguntas comuns

**Precisa pagar algo?** Não. Google Apps Script e GitHub Pages são gratuitos. Há cotas diárias no Apps Script (milhares de envios/dia), muito acima do uso esperado.

**Mudei o script depois de publicar. E agora?** Toda vez que editar o `apps-script.gs`, no editor faça **Implantar → Gerenciar implantações → (a sua) → editar (lápis) → Versão: Nova versão → Implantar**. Assim a mesma URL `/exec` passa a valer a nova versão (a URL não muda). Se criar uma implantação nova do zero, a URL muda e você precisa atualizar o `index.html`.

**As respostas são anônimas?** Não — o formulário pede nome e e-mail de propósito, porque o PDI é individual. O aviso de consentimento (LGPD) explica isso a quem responde.

**O envio falhou para alguém.** O formulário tem rede de segurança: se o envio automático não confirmar, ele mostra o resumo e pede para a pessoa copiar e mandar ao RH. Nenhum dado se perde.

**Posso mudar as perguntas?** Sim, no `index.html`. Se adicionar/remover campos, lembre de refletir isso no `apps-script.gs` (a lista `COLUNAS` e a montagem da `linha` em `doPost`).
