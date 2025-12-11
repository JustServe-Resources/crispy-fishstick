import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
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
  }
`;

export const NotesSection = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export const Sidebar = styled.div`
  border-left: 1px solid #eee;
  padding-left: 20px;
`;
