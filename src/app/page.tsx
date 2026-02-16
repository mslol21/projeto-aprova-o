'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Building2, 
  Calendar, 
  Smartphone, 
  Zap,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const FeatureCard = ({ icon: Icon, title, description }: any) => (
    <div 
      className="card animate-fade-in" 
      style={{ 
        padding: '2.5rem', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        gap: '1.5rem',
        textAlign: 'left',
        background: 'linear-gradient(135deg, var(--background) 0%, var(--muted) 100%)',
        border: '1px solid var(--border)',
        borderRadius: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(30, 58, 138, 0.2)'
        e.currentTarget.style.borderColor = 'var(--primary)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        transform: 'translate(30%, -30%)'
      }} />
      <div style={{ 
        padding: '1rem', 
        background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
        borderRadius: '1rem', 
        color: 'white',
        boxShadow: '0 10px 20px -5px rgba(30, 58, 138, 0.3)',
        position: 'relative',
        zIndex: 1
      }}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h3 style={{ 
          fontSize: '1.375rem', 
          fontWeight: '800', 
          marginBottom: '0.75rem',
          letterSpacing: '-0.01em',
          color: 'var(--foreground)'
        }}>
          {title}
        </h3>
        <p style={{ 
          fontSize: '0.9375rem', 
          color: 'var(--muted-foreground)', 
          lineHeight: '1.7',
          fontWeight: '400'
        }}>
          {description}
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', overflowX: 'hidden' }}>
      {/* Dynamic Background Gradient Decor */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '60%',
        height: '600px',
        background: 'radial-gradient(circle, rgba(30, 58, 138, 0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Navbar */}
      <nav style={{ 
        padding: '1.5rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image 
            src="/icons/app-icon.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            style={{ borderRadius: '6px' }}
            priority
          />
          <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>PROJETO APROVAÇÃO</span>
        </div>
        <div>
          {user ? (
            <button onClick={() => router.push('/dashboard')} className="btn btn-primary" style={{ width: 'auto' }}>
              Dashboard <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </button>
          ) : (
            <button onClick={() => router.push('/login')} className="btn btn-secondary" style={{ width: 'auto' }}>
              Entrar
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '8rem 1.5rem 6rem 1.5rem', 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.6rem 1.25rem', 
          backgroundColor: 'rgba(30, 58, 138, 0.1)', 
          backdropFilter: 'blur(10px)',
          color: 'var(--primary)', 
          borderRadius: '999px',
          fontSize: '0.875rem',
          fontWeight: '700',
          marginBottom: '2.5rem',
          border: '1px solid rgba(30, 58, 138, 0.2)',
          boxShadow: '0 4px 12px rgba(30,58,138,0.05)'
        }}>
          <Zap size={14} /> NOVO: Calendário de Estudos Estilo Google
        </div>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
          fontWeight: '900', 
          lineHeight: '1.1', 
          marginBottom: '2rem',
          letterSpacing: '-0.03em',
          color: 'var(--foreground)'
        }}>
          A aprovação é fruto de uma{' '}
          <span style={{ 
            position: 'relative',
            display: 'inline-block',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            base sólida
            <svg 
              style={{ 
                position: 'absolute', 
                bottom: '-8px', 
                left: 0, 
                width: '100%', 
                height: '10px' 
              }} 
              viewBox="0 0 200 10" 
              preserveAspectRatio="none"
            >
              <path 
                d="M0,8 Q50,0 100,8 T200,8" 
                stroke="#3b82f6" 
                strokeWidth="4" 
                fill="none" 
                opacity="0.4" 
              />
            </svg>
          </span>
          .
        </h1>
        <p style={{ 
          fontSize: 'clamp(1.125rem, 3.5vw, 1.35rem)', 
          color: 'var(--muted-foreground)', 
          marginBottom: '3rem',
          maxWidth: '720px',
          margin: '0 auto 3rem auto',
          lineHeight: '1.7',
          fontWeight: '400'
        }}>
          Transforme sua rotina no <strong style={{ color: 'var(--primary)' }}>Prédio da Aprovação</strong>. O único sistema que pune a procrastinação e recompensa a constância inabalável.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', boxShadow: '0 10px 20px -5px rgba(30,58,138,0.3)' }} onClick={() => router.push('/register')}>
            Iniciar Construção Grátis
          </button>
          <button className="btn btn-secondary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }} onClick={() => {
            const el = document.getElementById('features')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}>
            Explorar Recursos
          </button>
        </div>

        {/* Hero Visual Block */}
        <div style={{
          position: 'relative',
          padding: '2rem',
          backgroundColor: 'var(--accent)',
          borderRadius: '2rem',
          border: '1px solid var(--border)',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.1)',
          maxWidth: '800px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, var(--primary), #3b82f6, var(--primary))'
          }} />
          <Image 
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop" 
            alt="Mesa de estudos organizada" 
            width={800}
            height={400}
            style={{ width: '100%', borderRadius: '1rem', objectFit: 'cover', height: '400px' }}
            priority
          />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            padding: '1rem',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: '1px solid white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>FOCO TOTAL</p>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'black' }}>1,240 concurseiros ativos hoje.</p>
          </div>
        </div>
      </section>

      {/* Social Proof / Trust */}
      <section style={{ 
        padding: '3rem 1.5rem', 
        background: 'linear-gradient(to right, var(--muted), var(--background), var(--muted))', 
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          Focado em Alta Performance e Resultados
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', opacity: 0.6, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><Smartphone size={20} /> PWA Instalável</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><CheckCircle2 size={20} /> Offline-First</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}><Zap size={20} /> 100% JavaScript</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ 
        padding: '8rem 1.5rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '40%',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          zIndex: -1
        }} />
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '999px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '700',
            color: 'var(--primary)'
          }}>
            RECURSOS PRINCIPAIS
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
            fontWeight: '900', 
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tudo que você precisa para ser aprovado
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--muted-foreground)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Ferramentas profissionais para transformar sua rotina de estudos em resultados concretos.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <FeatureCard 
            icon={Clock} 
            title="Timer Inteligente" 
            description="Pomodoro de 50/25 minutos ou modo livre. O timer persiste mesmo se você fechar o navegador - zero desculpas para parar."
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Relatórios Visuais" 
            description="Gráficos detalhados por matéria e período. Veja exatamente onde você está investindo seu tempo e ajuste sua estratégia."
          />
          <FeatureCard 
            icon={Building2} 
            title="Prédio da Aprovação" 
            description="Sistema gamificado que cresce conforme sua constância. Cada dia de estudo adiciona um andar - quebre a sequência e o prédio desaba."
          />
          <FeatureCard 
            icon={Calendar} 
            title="Calendário Estilo Google" 
            description="Visualize todo seu histórico de estudos em um calendário intuitivo. Adicione notas diárias e acompanhe sua evolução."
          />
          <FeatureCard 
            icon={Smartphone} 
            title="PWA Offline-First" 
            description="Funciona perfeitamente sem internet. Instale no celular e desktop como um app nativo. Seus dados sincronizam automaticamente."
          />
          <FeatureCard 
            icon={Zap} 
            title="Sincronização Automática" 
            description="Estude no celular, veja no computador. Todos os seus dados sincronizam em tempo real entre dispositivos."
          />
        </div>
      </section>

      {/* "The Building" Deep Dive Section */}
      <section style={{ 
        padding: '8rem 1.5rem', 
        background: 'linear-gradient(145deg, var(--primary) 0%, #0f172a 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract lines bg */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div style={{ flex: '1 1 450px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.1' }}>A disciplina que você pode ver.</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: '1.8', marginBottom: '3rem' }}>
              O Prédio da Aprovação é o seu maior medidor de sucesso. Se você não estuda hoje, o prédio não sobe. Se você para por muito tempo, a estrutura colapsa.
              <br /><br />
              <span style={{ color: '#93c5fd', fontWeight: '700' }}>É a gamificação da seriedade.</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}><CheckCircle2 size={24} /></div>
                <span style={{ fontSize: '1.125rem' }}>30 dias para uma fundação inabalável</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}><CheckCircle2 size={24} /></div>
                <span style={{ fontSize: '1.125rem' }}>Andares extras para cada semana de foco</span>
              </div>
            </div>
          </div>
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              padding: '3rem', 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '3rem', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 50px 100px rgba(0,0,0,0.5)'
            }}>
              {/* Simple CSS Building representation for landing page visual */}
              <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: 100, height: 8, backgroundColor: 'white', opacity: 0.5, borderRadius: 2 }}></div>
                <div style={{ width: 70, height: 30, backgroundColor: 'white', borderRadius: 4, display: 'flex', gap: 4, padding: 4, justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}></div>
                  <div style={{ width: 10, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}></div>
                </div>
                <div style={{ width: 70, height: 30, backgroundColor: 'white', borderRadius: 4, display: 'flex', gap: 4, padding: 4, justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}></div>
                  <div style={{ width: 10, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}></div>
                </div>
                <div style={{ width: 70, height: 30, backgroundColor: 'white', borderRadius: 4, display: 'flex', gap: 4, padding: 4, justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}></div>
                  <div style={{ width: 10, height: 15, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ 
        padding: '8rem 1.5rem', 
        maxWidth: '1000px', 
        margin: '0 auto', 
        textAlign: 'center' 
      }}>
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '999px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '700',
            color: 'var(--primary)'
          }}>
            PLANOS E PREÇOS
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
            fontWeight: '900', 
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Escolha seu nível de compromisso
          </h2>
          <p style={{ 
            color: 'var(--muted-foreground)', 
            fontSize: '1.125rem',
            lineHeight: '1.7'
          }}>
            Comece grátis e evolua quando estiver pronto para resultados sérios.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '2.5rem',
          alignItems: 'stretch'
        }}>
          {/* Free Plan */}
          <div 
            className="card" 
            style={{ 
              padding: '3rem 2.5rem', 
              border: '1px solid var(--border)',
              borderRadius: '1.5rem',
              background: 'var(--background)',
              position: 'relative',
              transition: 'all 0.3s'
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              marginBottom: '0.5rem',
              color: 'var(--foreground)'
            }}>
              Gratuito
            </h3>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '900', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              R$ 0
            </div>
            <p style={{ 
              color: 'var(--muted-foreground)', 
              marginBottom: '2.5rem',
              fontSize: '0.9375rem'
            }}>
              Para começar sua jornada
            </p>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: '0 0 2.5rem 0', 
              textAlign: 'left', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem' 
            }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem' }}>Até 6 matérias</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem' }}>Histórico de 7 dias</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem' }}>Prédio até 3 andares</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem' }}>Timer persistente</span>
              </li>
            </ul>
            <button 
              className="btn btn-secondary" 
              onClick={() => router.push('/register')}
              style={{ width: '100%', padding: '1rem' }}
            >
              Começar Grátis
            </button>
          </div>

          {/* Premium Plan */}
          <div 
            className="card" 
            style={{ 
              padding: '3rem 2.5rem', 
              border: '2px solid var(--primary)', 
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              position: 'relative',
              boxShadow: '0 20px 40px -10px rgba(30, 58, 138, 0.2)',
              transform: 'scale(1.05)',
              transition: 'all 0.3s'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
              color: 'white',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)'
            }}>
              ⭐ Mais Popular
            </div>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              marginBottom: '0.5rem',
              color: 'var(--primary)'
            }}>
              Premium
            </h3>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '900', 
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              R$ 19,90
            </div>
            <p style={{ 
              color: 'var(--muted-foreground)', 
              marginBottom: '2.5rem',
              fontSize: '0.9375rem'
            }}>
              Por mês • Cancele quando quiser
            </p>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: '0 0 2.5rem 0', 
              textAlign: 'left', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1rem' 
            }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600' }}>Matérias ilimitadas</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600' }}>Histórico completo</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600' }}>Prédio sem limite</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600' }}>Calendário avançado</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: '600' }}>Suporte prioritário</span>
              </li>
            </ul>
            <button 
              className="btn btn-primary" 
              onClick={() => router.push('/register')}
              style={{ 
                width: '100%', 
                padding: '1rem',
                fontSize: '1.0625rem',
                fontWeight: '700'
              }}
            >
              Começar Premium
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer style={{ 
        padding: '5rem 1.5rem', 
        backgroundColor: 'var(--muted)', 
        borderTop: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>Pronto para levar a sério?</h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Junte-se a milhares de concurseiros que medem a evolução ao invés de apenas contar dias.</p>
          <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={() => router.push('/register')}>
            Criar Minha Conta Grátis
          </button>
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
             <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
               © {new Date().getFullYear()} Projeto Aprovação. Todos os direitos reservados.
               <br />
               “A aprovação é consequência da constância.”
             </p>
             <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem' }}>
                <a href="#" style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }}>Política de Privacidade</a>
                <a href="#" style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }}>Termos de Uso</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
