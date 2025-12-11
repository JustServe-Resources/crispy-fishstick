import styled from 'styled-components';
import { Option } from '@zendeskgarden/react-dropdowns';

export const StyledOption = styled(Option)`
  && {
    white-space: normal;
    word-break: break-word;
    line-height: 1.4;
    height: auto;
    min-height: 32px;
    padding: 8px 4px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const Container = styled.div`
  margin-bottom: 16px;
  margin-top: 4px;
`;

export const GlobalStyle = styled.div`
  [data-garden-id="dropdowns.combobox.listbox"] {
    min-width: 600px !important;
    width: 600px !important;
    max-width: none !important;
  }
`;
