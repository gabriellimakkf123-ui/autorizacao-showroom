document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // DOM ELEMENTS - FORM & INTERFACE
    // ==========================================================================
    const form = document.getElementById('form-autorizacao');
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    const btnPrint = document.getElementById('btn-print');
    const btnReset = document.getElementById('btn-reset');
    const btnClearSig = document.getElementById('btn-clear-sig');
    const historyList = document.getElementById('history-list');

    // Elementos de Entrada
    const inputTipoVeiculo = document.getElementById('input-tipo-veiculo');
    const inputModelo = document.getElementById('input-modelo');
    const inputIdentificacao = document.getElementById('input-identificacao');
    const inputUso = document.getElementById('input-uso');
    const inputCombustivel = document.getElementById('input-combustivel');
    const inputEstado = document.getElementById('input-estado');
    const inputAvarias = document.getElementById('input-avarias');
    const inputCondutorNome = document.getElementById('input-condutor-nome');
    const inputCondutorDoc = document.getElementById('input-condutor-doc');
    const inputCondutorTel = document.getElementById('input-condutor-tel');
    const inputCondutorVinculo = document.getElementById('input-condutor-vinculo');
    const inputMotivo = document.getElementById('input-motivo');
    const inputDestino = document.getElementById('input-destino');
    const inputDataSaida = document.getElementById('input-data-saida');
    const inputDataRetorno = document.getElementById('input-data-retorno');
    const inputAutorizador = document.getElementById('input-autorizador');
    const inputTerceiroNome = document.getElementById('input-terceiro-nome');
    const inputTerceiroCargo = document.getElementById('input-terceiro-cargo');
    const signaturePad = document.getElementById('signature-pad');

    // Rótulos Dinâmicos (Formulário)
    const lblIdentificacao = document.getElementById('lbl-identificacao');
    const lblUso = document.getElementById('lbl-uso');
    const lblColete = document.getElementById('lbl-colete');
    const lblSeguranca = document.getElementById('lbl-seguranca');

    // ==========================================================================
    // DOM ELEMENTS - DOCUMENT PREVIEW (A4)
    // ==========================================================================
    const docLogoIcon = document.getElementById('doc-logo-icon');
    const docOutputId = document.getElementById('doc-output-id');
    const docOutputEmissao = document.getElementById('doc-output-emissao');
    const docOutTipo = document.getElementById('doc-out-tipo');
    const docOutModelo = document.getElementById('doc-out-modelo');
    const docOutIdentificacao = document.getElementById('doc-out-identificacao');
    const docOutUso = document.getElementById('doc-out-uso');
    const docOutCombustivelFill = document.getElementById('doc-out-combustivel-fill');
    const docOutCombustivelText = document.getElementById('doc-out-combustivel-text');
    const docOutEstado = document.getElementById('doc-out-estado');
    const docOutAvarias = document.getElementById('doc-out-avarias');
    const docOutAcessorios = document.getElementById('doc-out-acessorios');
    const docOutCondutorNome = document.getElementById('doc-out-condutor-nome');
    const docOutCondutorVinculo = document.getElementById('doc-out-condutor-vinculo');
    const docOutCondutorDoc = document.getElementById('doc-out-condutor-doc');
    const docOutCondutorTel = document.getElementById('doc-out-condutor-tel');
    const docOutMotivo = document.getElementById('doc-out-motivo');
    const docOutDestino = document.getElementById('doc-out-destino');
    const docOutDataSaida = document.getElementById('doc-out-data-saida');
    const docOutDataRetorno = document.getElementById('doc-out-data-retorno');
    
    // Rótulos Dinâmicos (Documento)
    const docLblOutIdentificacao = document.getElementById('doc-lbl-out-identificacao');
    const docLblOutUso = document.getElementById('doc-lbl-out-uso');

    // Assinaturas no Documento
    const docOutCondutorNomeSig = document.getElementById('doc-out-condutor-nome-sig');
    const docOutCondutorDocSig = document.getElementById('doc-out-condutor-doc-sig');
    const docOutSignatureImg = document.getElementById('doc-out-signature-img');
    const docSigLineAuth = document.getElementById('doc-sig-line-auth');
    const docOutAutorizadorSig = document.getElementById('doc-out-autorizador-sig');
    const docOutTerceiroNome = document.getElementById('doc-out-terceiro-nome');
    const docOutTerceiroCargo = document.getElementById('doc-out-terceiro-cargo');

    // ==========================================================================
    // INITIAL STATE / CONFIG
    // ==========================================================================
    let history = JSON.parse(localStorage.getItem('showroom_autorizacoes')) || [];
    let currentRecordId = '';
    let currentDocType = 'saida';

    const tabSaida = document.getElementById('tab-saida');
    const tabEntrada = document.getElementById('tab-entrada');

    function updateLabelsAndTexts() {
        const isSaida = currentDocType === 'saida';

        // Formulário
        document.getElementById('form-sec-3-title').textContent = isSaida ? 'Planejamento de Saída' : 'Planejamento de Entrada';
        document.getElementById('lbl-form-motivo').textContent = isSaida ? 'Motivo da Saída' : 'Motivo da Entrada';
        document.getElementById('lbl-form-destino').textContent = isSaida ? 'Destino Previsto' : 'Origem / Procedência';
        document.getElementById('lbl-form-data-saida').textContent = isSaida ? 'Data/Hora de Saída' : 'Data/Hora de Entrada';
        document.getElementById('lbl-form-data-retorno').textContent = isSaida ? 'Previsão de Retorno' : 'Previsão de Nova Saída';

        // Preview Documento A4
        document.getElementById('doc-title-main').textContent = isSaida ? 'AUTORIZAÇÃO DE SAÍDA DE VEÍCULO' : 'AUTORIZAÇÃO DE ENTRADA DE VEÍCULO';
        document.getElementById('doc-title-sub').textContent = isSaida 
            ? 'TERMO DE RESPONSABILIDADE E VISTORIA SIMPLIFICADA DE SAÍDA' 
            : 'TERMO DE RECEBIMENTO E VISTORIA SIMPLIFICADA DE ENTRADA';
        document.getElementById('doc-sec-3-title').textContent = isSaida ? '3. DADOS DE DESTINAÇÃO E CRONOGRAMA' : '3. DADOS DE ORIGEM E CRONOGRAMA';
        document.getElementById('doc-lbl-out-motivo').textContent = isSaida ? 'MOTIVO DA SAÍDA:' : 'MOTIVO DA ENTRADA:';
        document.getElementById('doc-lbl-out-destino').textContent = isSaida ? 'DESTINO PREVISTO:' : 'ORIGEM / PROCEDÊNCIA:';
        document.getElementById('doc-lbl-out-data-saida').textContent = isSaida ? 'DATA E HORÁRIO DE SAÍDA:' : 'DATA E HORÁRIO DE ENTRADA:';
        document.getElementById('doc-lbl-out-data-retorno').textContent = isSaida ? 'PREVISÃO DE RETORNO:' : 'PREVISÃO DE NOVA SAÍDA:';
        document.getElementById('doc-lbl-out-acessorios-title').textContent = isSaida ? 'ITENS CONFERIDOS NA SAÍDA:' : 'ITENS CONFERIDOS NA ENTRADA:';
        
        document.getElementById('doc-sec-4-title').textContent = isSaida ? '4. TERMO DE COMPROMISSO E RESPONSABILIDADE' : '4. TERMO DE RECEBIMENTO E DEVOLUÇÃO';
        
        const termsText = isSaida 
            ? 'Declaro, na qualidade de condutor e responsável, que recebi o veículo acima descrito em perfeitas condições de funcionamento e conservação. Comprometo-me a zelar por sua guarda e integridade durante todo o período em que estiver sob minha posse. Estou ciente e assumo total responsabilidade civil, administrativa e criminal por quaisquer danos causados ao veículo, a terceiros ou decorrentes de infrações de trânsito/navegação cometidas no período indicado nesta autorização. Comprometo-me a retornar com o veículo na data e horário previstos acima.'
            : 'Declaro, na qualidade de condutor e responsável, que devolvi o veículo acima descrito ao showroom da Ventura Experience na data e horário indicados nesta autorização. O veículo foi entregue nas condições de vistoria detalhadas neste termo. Fica registrado o encerramento da minha responsabilidade direta pela guarda do veículo a partir deste momento, ressalvadas eventuais avarias ou pendências não identificadas no ato da entrega.';
        document.getElementById('doc-out-terms').textContent = termsText;
    }

    function switchDocType(type) {
        currentDocType = type;
        if (type === 'saida') {
            tabSaida.classList.add('active');
            tabEntrada.classList.remove('active');
        } else {
            tabEntrada.classList.add('active');
            tabSaida.classList.remove('active');
        }
        
        updateLabelsAndTexts();
        updateVehicleLabels();
        updateTextPreviews();
    }

    tabSaida.addEventListener('click', () => switchDocType('saida'));
    tabEntrada.addEventListener('click', () => switchDocType('entrada'));

    // ==========================================================================
    // SIGNATURE PAD (CANVAS DRAWING)
    // ==========================================================================
    const ctx = signaturePad.getContext('2d');
    let isDrawing = false;
    let hasSignature = false;

    // Configuração do traço da assinatura
    ctx.strokeStyle = '#0f172a'; // Cor escura para parecer caneta
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function getMousePos(canvasDom, touchOrMouseEvent) {
        const rect = canvasDom.getBoundingClientRect();
        // Tratar toque mobile vs clique mouse
        const clientX = touchOrMouseEvent.touches ? touchOrMouseEvent.touches[0].clientX : touchOrMouseEvent.clientX;
        const clientY = touchOrMouseEvent.touches ? touchOrMouseEvent.touches[0].clientY : touchOrMouseEvent.clientY;
        
        // Calcular escala correta por causa das propriedades CSS de tamanho vs tamanho físico do Canvas
        return {
            x: (clientX - rect.left) * (canvasDom.width / rect.width),
            y: (clientY - rect.top) * (canvasDom.height / rect.height)
        };
    }

    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getMousePos(signaturePad, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const pos = getMousePos(signaturePad, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        hasSignature = true;
        updateSignaturePreview();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function clearSignature() {
        ctx.clearRect(0, 0, signaturePad.width, signaturePad.height);
        hasSignature = false;
        updateSignaturePreview();
    }

    function updateSignaturePreview() {
        if (hasSignature) {
            docOutSignatureImg.src = signaturePad.toDataURL();
            docOutSignatureImg.style.display = 'block';
            docSigLineAuth.style.display = 'none';
        } else {
            docOutSignatureImg.src = '';
            docOutSignatureImg.style.display = 'none';
            docSigLineAuth.style.display = 'block';
        }
    }

    // Eventos do Canvas para Mouse
    signaturePad.addEventListener('mousedown', startDrawing);
    signaturePad.addEventListener('mousemove', draw);
    signaturePad.addEventListener('mouseup', stopDrawing);
    signaturePad.addEventListener('mouseleave', stopDrawing);

    // Eventos do Canvas para Touch (Mobile)
    signaturePad.addEventListener('touchstart', startDrawing);
    signaturePad.addEventListener('touchmove', draw);
    signaturePad.addEventListener('touchend', stopDrawing);

    btnClearSig.addEventListener('click', clearSignature);

    // ==========================================================================
    // THEME MANAGEMENT (CLARO / ESCURO)
    // ==========================================================================
    function initTheme() {
        const storedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', storedTheme);
        updateThemeToggleIcon(storedTheme);
    }

    function updateThemeToggleIcon(theme) {
        const icon = btnThemeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    btnThemeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleIcon(newTheme);
    });

    // ==========================================================================
    // DYNAMIC LABELS & FORMS (MARINE vs LAND)
    // ==========================================================================
    function updateVehicleLabels() {
        const tipo = inputTipoVeiculo.value;
        const suffix = currentDocType === 'saida' ? 'SAÍDA' : 'ENTRADA';

        // Resetar Classes de Ícones de Documento
        docLogoIcon.className = 'logo-doc-icon fa-solid';

        if (tipo === 'barco') {
            // Rótulos do Formulário
            lblIdentificacao.textContent = 'Nº Inscrição da Capitania';
            lblUso.textContent = 'Horímetro Atual (Horas)';
            inputUso.placeholder = 'Ex: 124';
            document.getElementById('chk-colete-wrapper').style.display = 'flex';
            lblColete.textContent = 'Coletes Salva-vidas';
            
            // Rótulos da Visualização A4
            docLogoIcon.classList.add('fa-anchor');
            docLblOutIdentificacao.textContent = 'INSCRIÇÃO (CAPITANIA):';
            docLblOutUso.textContent = `HORÍMETRO DE ${suffix}:`;
            
            // Atualiza Tipo no documento
            docOutTipo.textContent = 'Barco / Lancha';
        } else if (tipo === 'jetski') {
            lblIdentificacao.textContent = 'Nº Inscrição / TIE';
            lblUso.textContent = 'Horímetro Atual (Horas)';
            inputUso.placeholder = 'Ex: 48';
            document.getElementById('chk-colete-wrapper').style.display = 'flex';
            lblColete.textContent = 'Coletes Salva-vidas';
            
            docLogoIcon.classList.add('fa-water');
            docLblOutIdentificacao.textContent = 'INSCRIÇÃO / REGISTRO:';
            docLblOutUso.textContent = `HORÍMETRO DE ${suffix}:`;
            docOutTipo.textContent = 'Moto Aquática';
        } else {
            // Quadriciclo, Carro ou Outro
            lblIdentificacao.textContent = 'Placa / Nº do Chassi';
            lblUso.textContent = 'Odômetro Atual (KM)';
            inputUso.placeholder = 'Ex: 12500';
            document.getElementById('chk-colete-wrapper').style.display = 'none';
            
            if (tipo === 'quadriciclo') {
                docLogoIcon.classList.add('fa-truck-monster');
                docOutTipo.textContent = 'Quadriciclo / ATV';
            } else if (tipo === 'carro') {
                docLogoIcon.classList.add('fa-car');
                docOutTipo.textContent = 'Carro / Utilitário';
            } else {
                docLogoIcon.classList.add('fa-dharmachakra');
                docOutTipo.textContent = 'Veículo Customizado';
            }

            docLblOutIdentificacao.textContent = 'PLACA / CHASSI:';
            docLblOutUso.textContent = `ODÔMETRO DE ${suffix}:`;
        }
        
        // Disparar atualização do checklist
        updateChecklistPreview();
    }

    inputTipoVeiculo.addEventListener('change', updateVehicleLabels);

    // ==========================================================================
    // REAL-TIME PREVIEW DATA BINDING
    // ==========================================================================
    function updateTextPreviews() {
        // Vinculando campos simples
        docOutModelo.textContent = inputModelo.value || '-';
        docOutIdentificacao.textContent = inputIdentificacao.value || '-';
        
        const usoVal = inputUso.value;
        const tipo = inputTipoVeiculo.value;
        const unidadeUso = (tipo === 'barco' || tipo === 'jetski') ? ' hrs' : ' km';
        docOutUso.textContent = usoVal ? `${usoVal}${unidadeUso}` : '-';

        // Combustível
        const combVal = inputCombustivel.value;
        docOutCombustivelFill.style.width = `${combVal}%`;
        docOutCombustivelText.textContent = `${combVal}%`;

        // Estado Geral
        docOutEstado.textContent = inputEstado.value;
        docOutAvarias.textContent = inputAvarias.value || 'Nenhuma avaria observada.';

        // Condutor
        docOutCondutorNome.textContent = inputCondutorNome.value || '-';
        docOutCondutorVinculo.textContent = inputCondutorVinculo.value;
        docOutCondutorDoc.textContent = inputCondutorDoc.value || '-';
        docOutCondutorTel.textContent = inputCondutorTel.value || '-';

        // Detalhes da Saída
        docOutMotivo.textContent = inputMotivo.value;
        docOutDestino.textContent = inputDestino.value || '-';

        // Datas
        docOutDataSaida.textContent = formatDateTime(inputDataSaida.value);
        docOutDataRetorno.textContent = formatDateTime(inputDataRetorno.value);

        // Autorizador / Assinatura
        docOutAutorizadorSig.textContent = inputAutorizador.value ? inputAutorizador.value.toUpperCase() : 'GERENTE / AUTORIZADOR';
        docOutCondutorNomeSig.textContent = inputCondutorNome.value ? inputCondutorNome.value.toUpperCase() : 'RESPONSÁVEL';
        docOutCondutorDocSig.textContent = `CPF/RG: ${inputCondutorDoc.value || '-'}`;
        docOutTerceiroNome.textContent = inputTerceiroNome.value ? inputTerceiroNome.value.toUpperCase() : 'TESTEMUNHA / OUTRO';
        docOutTerceiroCargo.textContent = inputTerceiroCargo.value ? inputTerceiroCargo.value.toUpperCase() : 'ASSINATURA ADICIONAL';
    }

    function formatDateTime(dateTimeString) {
        if (!dateTimeString) return '-';
        try {
            const date = new Date(dateTimeString);
            if (isNaN(date.getTime())) return '-';
            
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${day}/${month}/${year} às ${hours}:${minutes}`;
        } catch {
            return '-';
        }
    }

    function updateChecklistPreview() {
        const checkboxes = document.querySelectorAll('input[name="acessorio"]');
        let html = '';
        checkboxes.forEach(chk => {
            const wrapper = chk.closest('.check-item');
            if (wrapper && wrapper.style.display === 'none') return;

            const isChecked = chk.checked;
            const icon = isChecked ? 'fa-regular fa-square-check' : 'fa-regular fa-square';
            const itemClass = isChecked ? 'doc-check-tag checked' : 'doc-check-tag';
            
            let labelText = '';
            if (chk.value === 'chave') labelText = 'Chave de Partida';
            else if (chk.value === 'colete') labelText = 'Coletes Salva-vidas';
            else if (chk.value === 'nota_fiscal') labelText = 'Nota Fiscal com Termo de Garantia';
            else if (chk.value === 'ferramentas') labelText = 'Kit de Ferramentas';
            
            html += `<span class="${itemClass}"><i class="${icon}"></i> ${labelText}</span>`;
        });
        docOutAcessorios.innerHTML = html;
    }

    // Vincular todos os inputs a eventos de Input/Change
    form.addEventListener('input', updateTextPreviews);
    
    // Checkboxes necessitam de escuta separada por click
    form.querySelectorAll('input[type="checkbox"]').forEach(chk => {
        chk.addEventListener('change', updateChecklistPreview);
    });

    // Slider de combustível e seleção de tipo
    inputCombustivel.addEventListener('input', updateTextPreviews);
    inputTipoVeiculo.addEventListener('change', () => {
        updateVehicleLabels();
        updateTextPreviews();
    });

    // ==========================================================================
    // INITIALIZATION VALUES
    // ==========================================================================
    function resetForm() {
        form.reset();
        
        // Gerar ID do Registro
        generateNewRecordId();
        
        // Setar datas default
        const now = new Date();
        const dateSaidaString = formatLocalDatetimeISO(now);
        
        // 2 horas depois
        const later = new Date(now.getTime() + (2 * 60 * 60 * 1000));
        const dateRetornoString = formatLocalDatetimeISO(later);

        inputDataSaida.value = dateSaidaString;
        inputDataRetorno.value = dateRetornoString;
        inputTerceiroNome.value = '';
        inputTerceiroCargo.value = '';

        // Preencher data de emissão no papel
        const formattedToday = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        docOutputEmissao.textContent = formattedToday;

        clearSignature();
        switchDocType('saida');
    }

    // Formatar data local para o input datetime-local do HTML5 (YYYY-MM-DDTHH:MM)
    function formatLocalDatetimeISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function generateNewRecordId() {
        const currentYear = new Date().getFullYear();
        const sequence = String(history.length + 1).padStart(4, '0');
        currentRecordId = `${currentYear}-${sequence}`;
        docOutputId.textContent = currentRecordId;
    }

    btnReset.addEventListener('click', () => {
        if (confirm('Tem certeza de que deseja limpar todos os campos do formulário?')) {
            resetForm();
        }
    });

    // ==========================================================================
    // HISTORY STORAGE (SALVAR, CARREGAR, EXCLUIR)
    // ==========================================================================
    function saveToHistory() {
        const accessories = [];
        form.querySelectorAll('input[name="acessorio"]:checked').forEach(chk => {
            accessories.push(chk.value);
        });

        const record = {
            id: currentRecordId,
            dateCreated: new Date().toISOString(),
            docType: currentDocType,
            tipoVeiculo: inputTipoVeiculo.value,
            modelo: inputModelo.value,
            identificacao: inputIdentificacao.value,
            uso: inputUso.value,
            combustivel: inputCombustivel.value,
            estado: inputEstado.value,
            avarias: inputAvarias.value,
            acessorios: accessories,
            condutorNome: inputCondutorNome.value,
            condutorDoc: inputCondutorDoc.value,
            condutorTel: inputCondutorTel.value,
            condutorVinculo: inputCondutorVinculo.value,
            motivo: inputMotivo.value,
            destino: inputDestino.value,
            dataSaida: inputDataSaida.value,
            dataRetorno: inputDataRetorno.value,
            autorizador: inputAutorizador.value,
            terceiroNome: inputTerceiroNome.value,
            terceiroCargo: inputTerceiroCargo.value,
            signatureData: hasSignature ? signaturePad.toDataURL() : ''
        };

        // Procurar se já existe e atualizar, senão adiciona
        const index = history.findIndex(item => item.id === record.id);
        if (index > -1) {
            history[index] = record;
        } else {
            // Manter limite de 10 registros
            if (history.length >= 10) {
                history.pop();
            }
            history.unshift(record);
        }

        localStorage.setItem('showroom_autorizacoes', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = '<li class="history-empty">Nenhum registro emitido nesta sessão.</li>';
            return;
        }

        historyList.innerHTML = '';
        history.forEach(record => {
            const li = document.createElement('li');
            li.className = 'history-item';
            
            const date = new Date(record.dateCreated);
            const timeStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const typeLabel = (record.docType || 'saida') === 'saida' ? 'Saída' : 'Entrada';

            li.innerHTML = `
                <div class="history-info">
                    <strong>Nº ${record.id} (${typeLabel}) - ${record.modelo || 'Sem Modelo'}</strong>
                    <span>Condutor: ${record.condutorNome || 'N/A'} (${timeStr})</span>
                </div>
                <div class="history-actions">
                    <button class="btn-history-load" data-id="${record.id}" title="Recarregar dados">
                        <i class="fa-solid fa-folder-open"></i>
                    </button>
                    <button class="btn-history-delete" data-id="${record.id}" title="Excluir registro">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            historyList.appendChild(li);
        });

        // Registrar eventos nos botões recém-criados
        document.querySelectorAll('.btn-history-load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                loadRecord(id);
            });
        });

        document.querySelectorAll('.btn-history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                if (confirm(`Excluir a autorização nº ${id} do histórico?`)) {
                    deleteRecord(id);
                }
            });
        });
    }

    function loadRecord(id) {
        const record = history.find(item => item.id === id);
        if (!record) return;

        currentRecordId = record.id;
        docOutputId.textContent = record.id;

        // Definir data da emissão a partir da data do registro
        const date = new Date(record.dateCreated);
        docOutputEmissao.textContent = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

        // Preencher inputs
        inputTipoVeiculo.value = record.tipoVeiculo;
        inputModelo.value = record.modelo;
        inputIdentificacao.value = record.identificacao;
        inputUso.value = record.uso;
        inputCombustivel.value = record.combustivel;
        inputEstado.value = record.estado;
        inputAvarias.value = record.avarias;
        
        inputCondutorNome.value = record.condutorNome;
        inputCondutorDoc.value = record.condutorDoc;
        inputCondutorTel.value = record.condutorTel;
        inputCondutorVinculo.value = record.condutorVinculo;
        
        inputMotivo.value = record.motivo;
        inputDestino.value = record.destino;
        inputDataSaida.value = record.dataSaida;
        inputDataRetorno.value = record.dataRetorno;
        
        inputAutorizador.value = record.autorizador;
        inputTerceiroNome.value = record.terceiroNome || '';
        inputTerceiroCargo.value = record.terceiroCargo || '';

        // Tratar checkboxes
        form.querySelectorAll('input[name="acessorio"]').forEach(chk => {
            chk.checked = record.acessorios.includes(chk.value);
        });

        // Carregar assinatura no canvas
        clearSignature();
        if (record.signatureData) {
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                hasSignature = true;
                updateSignaturePreview();
            };
            img.src = record.signatureData;
        } else {
            hasSignature = false;
            updateSignaturePreview();
        }

        switchDocType(record.docType || 'saida');
    }

    function deleteRecord(id) {
        history = history.filter(item => item.id !== id);
        localStorage.setItem('showroom_autorizacoes', JSON.stringify(history));
        renderHistory();
        
        // Se deletamos a autorização ativa atual, reiniciamos o ID e reconfiguramos
        if (currentRecordId === id) {
            resetForm();
        }
    }

    // ==========================================================================
    // IMPRESSÃO E EXECUÇÃO
    // ==========================================================================
    btnPrint.addEventListener('click', () => {
        // Validar formulário
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Salvar registro
        saveToHistory();

        // Chamar o diálogo de impressão nativo
        window.print();
    });

    // ==========================================================================
    // NAVEGAÇÃO MOBILE (FORMULÁRIO VS PREVIEW)
    // ==========================================================================
    const mobileBtnForm = document.getElementById('mobile-btn-form');
    const mobileBtnPreview = document.getElementById('mobile-btn-preview');
    const appContainer = document.querySelector('.app-container');

    if (mobileBtnForm && mobileBtnPreview && appContainer) {
        mobileBtnForm.addEventListener('click', () => {
            mobileBtnForm.classList.add('active');
            mobileBtnPreview.classList.remove('active');
            appContainer.classList.remove('show-preview');
        });

        mobileBtnPreview.addEventListener('click', () => {
            mobileBtnPreview.classList.add('active');
            mobileBtnForm.classList.remove('active');
            appContainer.classList.add('show-preview');
        });
    }

    // ==========================================================================
    // STARTUP
    // ==========================================================================
    initTheme();
    resetForm();
    renderHistory();
});
