import styled from 'styled-components';

export const SettingsContainer = styled.div`
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  margin-bottom: 12px;

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;
