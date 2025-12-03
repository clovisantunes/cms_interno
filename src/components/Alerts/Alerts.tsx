import React from 'react';
import styles from './styles.module.scss';

interface AlertasProps {
  isVisible: boolean;
}

export const Alertas: React.FC<AlertasProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className={styles.alertasContainer}>
      <div className={styles.alertasContent}>
        <h2 className={styles.alertasTitle}>📢 Liberada a emissão de notas fiscais</h2>
        <div className={styles.alertasText}>
          <p className={styles.alertasWarning}>
            <strong>IMPORTANTE:</strong> Quando houver um pedido para não gerar notas fiscais, 
            é de suma importância que ninguém fique clicando no botão <strong>GERAR NOTA FISCAL</strong>.
          </p>
          
          <p>
            Tivemos um problema com o certificado das notas no sábado, foi comunicado e orientado 
            para somente imprimir o recibo. Apenas agora a <strong>4UP liberou a emissão de nota</strong>, 
            mas vimos que várias notas já estavam na fila de geração e foram geradas antes da 
            liberação pois foi clicado no botão de gerar.
          </p>
          
          <div className={styles.alertasInstructions}>
            <h4>Procedimento correto:</h4>
            <ul>
              <li>
                <strong>Quando for pedido para não gerar notas:</strong> 
                Não clique no botão "GERAR NOTA FISCAL"
              </li>
              <li>
                <strong>Apenas imprima o recibo</strong> quando necessário
              </li>
              <li>
                <strong>Aguarde comunicação oficial</strong> da liberação
              </li>
              <li>
                <strong>Quando estiver liberado</strong> iremos avisar a todos
              </li>
            </ul>
          </div>
          
          <p className={styles.alertasNote}>
            Obrigado pela atenção e colaboração de todos.
          </p>
        </div>
      </div>
    </div>
  );
};