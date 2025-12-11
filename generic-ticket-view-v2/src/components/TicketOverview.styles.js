import styled from 'styled-components';
import { Pane } from '@zendeskgarden/react-grid';

export const Container = styled.div`
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  input {
    font-size: 24px;
    font-weight: bold;
    border: 1px solid transparent;
    &:hover, &:focus {
      border-color: #ddd;
    }
    width: 100%;
  }
`;

export const MainPaneContent = styled(Pane.Content)`
  padding-right: 20px;
  overflow-y: auto;
  height: 100%;
`;

export const SidebarPaneContent = styled(Pane.Content)`
  padding-left: 20px;
  overflow-y: auto;
  height: 100%;
`;

export const NotesSection = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;
