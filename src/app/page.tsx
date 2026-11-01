import Link from "next/link";

const areas = [
  { icon: "◎", title: "Comunidade", text: "Troque experiências, tire dúvidas e celebre conquistas." },
  { icon: "▤", title: "Biblioteca", text: "Acesse materiais gratuitos para sua jornada em CS." },
  { icon: "▦", title: "Agenda", text: "Acompanhe mentorias, encontros e workshops." },
  { icon: "↗", title: "Oportunidades", text: "Encontre caminhos para desenvolver sua carreira." },
];

export default function Home() {
  return (
    <main>
      <header className="topbar">
        <Link className="brand" href="/">CS <span>DELAS</span><small>CONEXÃO EM MOVIMENTO</small></Link>
        <nav><a href="#sobre">Sobre</a><a href="#espacos">O que você encontra</a><Link className="nav-button" href="/solicitar-acesso">Solicitar acesso</Link></nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">COMUNIDADE GRATUITA • FEITA POR MULHERES</span>
          <h1>Seu próximo passo começa com <em>uma conexão.</em></h1>
          <p>Um espaço para aprender, compartilhar experiências e crescer profissionalmente na área de Customer Service.</p>
          <div className="actions">
            <Link className="button primary" href="/solicitar-acesso">Quero fazer parte <span>→</span></Link>
            <a className="text-link" href="#sobre">Conheça a CS DELAS</a>
          </div>
          <p className="micro">A participação é gratuita e realizada mediante aprovação do cadastro.</p>
        </div>
        <div className="hero-art" aria-label="Ilustração abstrata de conexão e crescimento">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="art-center">CS<br/><b>DELAS</b></div>
          <span className="bubble bubble-a">troca</span><span className="bubble bubble-b">apoio</span><span className="bubble bubble-c">crescimento</span>
          <span className="spark spark-a">✳</span><span className="spark spark-b">✦</span>
        </div>
      </section>

      <section className="intro" id="sobre">
        <span className="eyebrow">NOSSO PROPÓSITO</span>
        <h2>Uma impulsiona a outra.<br/><em>E juntas, avançam.</em></h2>
        <p>A CS DELAS aproxima mulheres que querem desenvolver habilidades, ampliar sua rede de apoio e descobrir novas possibilidades profissionais.</p>
      </section>

      <section className="spaces" id="espacos">
        <div className="section-heading"><div><span className="eyebrow">UM ESPAÇO PARA CRESCER</span><h2>O que você encontra por aqui?</h2></div></div>
        <div className="area-grid">
          {areas.map((area) => <article className="area-card" key={area.title}><span className="area-icon">{area.icon}</span><h3>{area.title}</h3><p>{area.text}</p></article>)}
        </div>
      </section>

      <section className="closing">
        <span className="eyebrow">VAMOS JUNTAS?</span>
        <h2>Seu conhecimento cresce quando é compartilhado.</h2>
        <p>Solicite sua participação e venha construir essa rede com a gente.</p>
        <Link className="button light" href="/solicitar-acesso">Solicitar acesso gratuito <span>→</span></Link>
      </section>
      <footer><Link className="brand footer-brand" href="/">CS <span>DELAS</span></Link><p>Comunidade • Conhecimento • Oportunidades</p><small>© {new Date().getFullYear()} CS DELAS</small></footer>
    </main>
  );
}
