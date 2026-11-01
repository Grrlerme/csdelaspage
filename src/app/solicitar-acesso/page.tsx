 "use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function SolicitarAcesso() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!consent) return setMessage("É necessário confirmar que leu o aviso de privacidade.");
    const ageLimit = new Date();
    ageLimit.setFullYear(ageLimit.getFullYear() - 18);
    if (new Date(birthDate) > ageLimit) return setMessage("Neste primeiro lançamento, a comunidade é destinada a maiores de 18 anos.");
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("applications").insert({
        full_name: name.trim(),
        birth_date: birthDate,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        privacy_acknowledged: true,
      });
      if (error) throw error;
      setMessage("Solicitação enviada! A equipe da CS DELAS analisará seu cadastro.");
      setName(""); setBirthDate(""); setEmail(""); setPhone(""); setConsent(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <header className="topbar"><Link className="brand" href="/">CS <span>DELAS</span><small>CONEXÃO EM MOVIMENTO</small></Link><Link className="text-link" href="/">← Voltar ao início</Link></header>
      <section className="form-shell">
        <span className="eyebrow">FAÇA PARTE DA COMUNIDADE</span>
        <h1>Vamos nos conhecer?</h1>
        <p>Preencha seus dados para solicitar acesso gratuito à CS DELAS. Sua solicitação ficará pendente até a análise da administradora.</p>
        <form onSubmit={handleSubmit}>
          <label>Nome completo<input required minLength={3} value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome completo"/></label>
          <label>Data de nascimento<input required type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} max={new Date().toISOString().slice(0,10)}/></label>
          <label>E-mail<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></label>
          <label>Telefone / WhatsApp<input required type="tel" minLength={8} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(00) 00000-0000"/></label>
          <label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>Li o aviso de privacidade e concordo com o uso dos dados para análise e gestão da minha solicitação.</span></label>
          <button className="button primary" disabled={loading}>{loading ? "Enviando..." : "Enviar solicitação →"}</button>
          {message && <p className="form-message" role="status">{message}</p>}
        </form>
        <small className="privacy-note">A CS DELAS não deve publicar seus dados pessoais. O acesso aos cadastros será restrito à administradora.</small>
      </section>
      <footer><Link className="brand footer-brand" href="/">CS <span>DELAS</span></Link><small>Comunidade gratuita mediante aprovação.</small></footer>
    </main>
  );
}
