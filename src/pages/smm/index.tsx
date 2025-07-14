import React from 'react';
import { useRouter } from 'next/router';
import Page from '@components/page';
import styles from './smm.module.css';

const SMMPage = () => {
  const router = useRouter();

  return (
    <Page meta={{ title: 'NEUROCODER - SMM на автопилоте', description: 'Революционная услуга SMM на автопилоте' }}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            NEUROCODER - SMM на автопилоте
          </h1>
          <p className={styles.subtitle}>
            Революционная услуга, которая сочетает в себе передовые технологии автоматизации создания контента, нейронных сетей и управления через телеграм-бота
          </p>
        </div>

        <section className={styles.features}>
          <h2>Что мы предлагаем:</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>🎬 Генерация рилс</h3>
              <p>Автоматизированный процесс создания высококачественных рилс напрямую из ваших креативов в Adobe After Effects</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🧠 Нейронные сети</h3>
              <p>Система использует нейронные сети, обученные на ваших данных для генерации контента</p>
            </div>
            <div className={styles.featureCard}>
              <h3>🤖 Телеграм-бот</h3>
              <p>Управляйте всем процессом генерации контента прямо из вашего мобильного устройства</p>
            </div>
            <div className={styles.featureCard}>
              <h3>📱 Автопостинг</h3>
              <p>Автоматическая публикация контента в Instagram в оптимальное время</p>
            </div>
          </div>
        </section>

        <section className={styles.benefits}>
          <h2>Преимущества для вашего бизнеса:</h2>
          <ul>
            <li>⏰ Экономия времени и ресурсов</li>
            <li>📈 Повышение эффективности SMM-кампаний</li>
            <li>🎯 Упрощение управления</li>
            <li>🔧 Гибкость и адаптация под ваши нужды</li>
            <li>💡 Полная поддержка и обучение</li>
          </ul>
        </section>

        <section className={styles.pricing}>
          <div className={styles.priceCard}>
            <h2>Стоимость услуги</h2>
            <div className={styles.price}>$1000</div>
            <div className={styles.period}>в месяц</div>
            <p>Включает все перечисленные возможности и преимущества</p>
            <button 
              className={styles.ctaButton}
              onClick={() => window.open('https://t.me/your_bot', '_blank')}
            >
              Связаться с нами
            </button>
          </div>
        </section>

        <section className={styles.cta}>
          <h2>Готовы поднять ваш SMM на новый уровень?</h2>
          <p>Свяжитесь с нами сегодня, чтобы узнать больше!</p>
        </section>
      </div>
    </Page>
  );
};

export default SMMPage;
