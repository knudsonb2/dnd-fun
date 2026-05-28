import React from 'react';
import styled from 'styled-components';
import { Character } from '../../models/character.model';

const InventoryContainer = styled.div`
  margin-bottom: 2rem;
`;

const InventoryHeader = styled.h2`
  color: var(--text-strong);
  border-bottom: 2px solid color-mix(in oklch, var(--brand), white 64%);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const CurrencyContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  background: var(--surface-muted);
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 8px;
`;

const CurrencyItem = styled.div`
  text-align: center;
`;

const CurrencyName = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const CurrencyValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const EquipmentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const EquipmentCard = styled.div`
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 1rem;
  box-shadow: var(--shadow-sm);
`;

const EquipmentName = styled.h4`
  margin: 0 0 0.5rem 0;
  color: var(--text-strong);
`;

const EquipmentDetails = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

interface InventoryProps {
  character: Character;
}

const Inventory: React.FC<InventoryProps> = ({ character }) => {
  const getCurrencyTotal = () => {
    return character.inventory.currency.platinum * 1000 + 
           character.inventory.currency.gold * 100 + 
           character.inventory.currency.silver * 10 + 
           character.inventory.currency.copper;
  };

  return (
    <InventoryContainer>
      <InventoryHeader>Inventory</InventoryHeader>
      
      <CurrencyContainer>
        <CurrencyItem>
          <CurrencyName>Platinum</CurrencyName>
          <CurrencyValue>{character.inventory.currency.platinum}</CurrencyValue>
        </CurrencyItem>
        <CurrencyItem>
          <CurrencyName>Gold</CurrencyName>
          <CurrencyValue>{character.inventory.currency.gold}</CurrencyValue>
        </CurrencyItem>
        <CurrencyItem>
          <CurrencyName>Silver</CurrencyName>
          <CurrencyValue>{character.inventory.currency.silver}</CurrencyValue>
        </CurrencyItem>
        <CurrencyItem>
          <CurrencyName>Copper</CurrencyName>
          <CurrencyValue>{character.inventory.currency.copper}</CurrencyValue>
        </CurrencyItem>
        <CurrencyItem>
          <CurrencyName>Total</CurrencyName>
          <CurrencyValue>{getCurrencyTotal()} gp</CurrencyValue>
        </CurrencyItem>
      </CurrencyContainer>
      
      <EquipmentContainer>
        <EquipmentCard>
          <EquipmentName>Equipment</EquipmentName>
          <EquipmentDetails>
            {character.inventory.equipment.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </EquipmentDetails>
        </EquipmentCard>
      </EquipmentContainer>
    </InventoryContainer>
  );
};

export default Inventory;
