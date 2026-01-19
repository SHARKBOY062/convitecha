import { useMemo, useState } from 'react'
import ultra from '../assets/ultra.jpeg'

const SHEETDB_URL = 'https://sheetdb.io/api/v1/4y83tp53vaebv'

const OBS_FIXA =
  'Para quem quiser nos presentear, com qualquer mimo para o bebê será recebido com muito amor.'

function Counter({ label, value, setValue }) {
  function dec() {
    setValue((v) => Math.max(0, v - 1))
  }
  function inc() {
    setValue((v) => Math.min(20, v + 1))
  }

  return (
    <div className="counter">
      <div className="counterLabel">{label}</div>

      <div className="counterPill" role="group" aria-label={label}>
        <button type="button" className="counterBtn" onClick={dec} aria-label={`Diminuir ${label}`}>
          −
        </button>

        <div className="counterValue" aria-live="polite">
          {value}
        </div>

        <button type="button" className="counterBtn" onClick={inc} aria-label={`Aumentar ${label}`}>
          +
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)

  const [adultos, setAdultos] = useState(1)
  const [criancas, setCriancas] = useState(0)

  const [presenteMarca, setPresenteMarca] = useState('Pampers')
  const [presenteTamanho, setPresenteTamanho] = useState('M')

  const pixKey = 'helenoliveirasg@icloud.com'

  const mapsUrl = useMemo(() => {
    const address = 'Rua T-29, no Setor Bueno, Goiânia - GO, CEP 74210-050'
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }, [])

  function onOpen() {
    setSent(false)
    setOpen(true)
  }

  function onClose() {
    if (saving) return
    setOpen(false)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (saving) return

    const form = new FormData(e.currentTarget)

    const payload = {
      nome: String(form.get('nome') || '').trim(),
      whatsapp: String(form.get('whats') || '').trim(),
      adultos,
      criancas,
      fralda_marca: presenteMarca,
      fralda_tamanho: presenteTamanho,
      observacao: OBS_FIXA, // ✅ fixa e enviada para a planilha
      data: new Date().toLocaleString('pt-BR'),
    }

    if (!payload.nome || !payload.whatsapp) {
      alert('Preencha seu nome e WhatsApp 😊')
      return
    }

    try {
      setSaving(true)

      const res = await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [payload] }),
      })

      if (!res.ok) throw new Error('Falha ao salvar no SheetDB')

      setSent(true)
      e.currentTarget.reset()
      setAdultos(1)
      setCriancas(0)
      setPresenteMarca('Pampers')
      setPresenteTamanho('M')
    } catch (err) {
      console.error(err)
      alert('Não consegui salvar agora 😕 Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(pixKey)
      alert('Chave PIX copiada ✅')
    } catch {
      alert('Não consegui copiar automaticamente. Selecione e copie a chave 😉')
    }
  }

  return (
    <div className="screen">
      <div className="invite inviteCentered">
        <div className="hero">
          <h1 className="logo">
            <span className="logoGirl textIn textIn--1">Girl</span>
            <span className="logoOr textIn textIn--2">or</span>
            <span className="logoBoy textIn textIn--3">Boy</span>
          </h1>
        </div>

        <button className="cta textIn textIn--4" onClick={onOpen}>
          Confirmar presença
        </button>

        <div className="ultraFrame ultraFrame--sm textIn textIn--5" aria-label="Ultrassom">
          <div className="ultraInner">
            <img className="ultraImg" src={ultra} alt="Ultrassom do bebê" />
          </div>
        </div>

        <div className="details">
          <div className="col">
            <div className="top">FEVEREIRO</div>
            <div className="bottom">
              7 TH
              <br />
              2026
            </div>
          </div>

          <div className="vline" />

          <div className="col">
            <div className="top">A PARTIR</div>
            <div className="bottom">ÀS 19HRS.</div>
          </div>

          <div className="vline" />

          <div className="col">
            <div className="top">RESIDENCIAL</div>
            <a className="bottom bottomLink" href={mapsUrl} target="_blank" rel="noreferrer">
              SUBLIME
              <br />
              St.BUENO
            </a>
          </div>
        </div>

        <p className="punctualityNote">
          Para melhor aproveitarmos as entradas e o jantar, contamos com sua pontualidade.
        </p>
      </div>

      {open && (
        <div className="modalOverlay" onMouseDown={onClose} role="presentation">
          <div
            className="modalCard modalIn"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modalHeader">
              <div className="modalTitle">Confirmar presença</div>
              <button className="modalClose" onClick={onClose} aria-label="Fechar" disabled={saving}>
                ×
              </button>
            </div>

            {!sent ? (
              <form className="modalForm" onSubmit={onSubmit}>
                <div className="hintBox">
                  <div className="hintTitle">Dress code</div>
                  <div className="hintText">Branco ou Off-white 🤍</div>
                </div>

                <label className="field">
                  <span className="label">Seu nome</span>
                  <input className="input" name="nome" placeholder="Ex: Maria Clara" required disabled={saving} />
                </label>

                <label className="field">
                  <span className="label">WhatsApp</span>
                  <input
                    className="input"
                    name="whats"
                    placeholder="Ex: (62) 99999-9999"
                    required
                    disabled={saving}
                  />
                </label>

                <div className="counterGrid">
                  <Counter label="Adultos" value={adultos} setValue={setAdultos} />
                  <Counter label="Crianças" value={criancas} setValue={setCriancas} />
                </div>

                <div className="giftBox">
                  <div className="giftTitle">Sugestão de presente</div>

                  <div className="giftRow">
                    <label className="field" style={{ margin: 0 }}>
                      <span className="label">Fralda</span>
                      <div className="selectWrap">
                        <select
                          className="input selectInput"
                          value={presenteMarca}
                          onChange={(e) => setPresenteMarca(e.target.value)}
                          name="fralda_marca"
                          disabled={saving}
                        >
                          <option value="Pampers">Pampers</option>
                          <option value="Huggies">Huggies</option>
                        </select>
                        <span className="selectArrow" aria-hidden="true" />
                      </div>
                    </label>

                    <label className="field" style={{ margin: 0 }}>
                      <span className="label">Tamanho</span>
                      <div className="selectWrap">
                        <select
                          className="input selectInput"
                          value={presenteTamanho}
                          onChange={(e) => setPresenteTamanho(e.target.value)}
                          name="fralda_tamanho"
                          disabled={saving}
                        >
                          <option value="P">P</option>
                          <option value="M">M</option>
                          <option value="G">G</option>
                        </select>
                        <span className="selectArrow" aria-hidden="true" />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pixBox">
                  <div className="pixTitle">Presente via PIX</div>
                  <div className="pixText">Se preferir presentear via PIX, use a chave abaixo:</div>

                  <div className="pixRow">
                    <input className="input pixInput" value={pixKey} readOnly />
                    <button type="button" className="pixCopy" onClick={copyPix} disabled={saving}>
                      Copiar
                    </button>
                  </div>

                  <div className="pixHint"></div>
                </div>

                {/* ✅ mensagem fixa (sem textarea) */}
                <div className="giftFixedNote" aria-label="Observação">
                  {OBS_FIXA}
                </div>

                <button className="modalBtn" type="submit" disabled={saving}>
                  {saving ? 'Enviando...' : 'Enviar confirmação'}
                </button>

                <div className="modalHint">
                  Obrigado por confirmar ✨ vai ser um momento muito especial!
                </div>
              </form>
            ) : (
              <div className="modalSuccess">
                <div className="successTitle">Prontinho! 💙💗</div>
                <div className="successText">Sua confirmação foi registrada com sucesso.</div>
                <button className="modalBtn" onClick={onClose}>
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
