import styled from 'styled-components';
import { Grid } from '@zendeskgarden/react-grid';

export const Container = styled.div`
  padding: 20px;
  height: 100%;
`;
/* Added height 100% just in case */

export const FullWidthGrid = styled(Grid)`
  max-width: 100% !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
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

export const NotesSection = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export const Sidebar = styled.div`
  border-left: 1px solid #eee;
  padding-left: 20px;
  height: 100%;
`;

