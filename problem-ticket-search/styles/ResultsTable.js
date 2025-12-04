import styled from 'styled-components';

export const ResultsWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
`;

export const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #68737d;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
`;

export const SubjectLink = styled.span`
  color: #1f73b7;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
