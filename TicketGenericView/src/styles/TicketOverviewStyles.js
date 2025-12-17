import styled from 'styled-components';
import { Button } from '@zendeskgarden/react-buttons';

export const OverviewContainer = styled.div`
  padding: 16px;
  width: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const SectionHeader = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme?.palette?.grey?.[800] || '#2f3941'};
`;

export const SubjectHeader = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme?.palette?.grey?.[800] || '#2f3941'};
  flex: 1;
`;

export const SubjectEditContainer = styled.div`
  margin-bottom: 16px;
`;

export const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.theme?.palette?.grey?.[300] || '#d8dcde'};
`;

export const EditableFieldRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme?.palette?.grey?.[300] || '#d8dcde'};
`;

export const FieldLabel = styled.span`
  font-weight: 600;
  color: ${props => props.theme?.palette?.grey?.[700] || '#49545c'};
  font-size: 14px;
  margin-bottom: 4px;
`;

export const FieldValue = styled.span`
  color: ${props => props.theme?.palette?.grey?.[800] || '#2f3941'};
  font-size: 14px;
  word-break: break-word;
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const LoadingContainer = styled.div`
  padding: 24px;
  text-align: center;
  color: ${props => props.theme?.palette?.grey?.[600] || '#68737d'};
`;

export const DescriptionSection = styled.div`
  padding: 12px 0;
  color: ${props => props.theme?.palette?.grey?.[800] || '#2f3941'};
  line-height: 1.6;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CommentHistoryColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SidebarColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SidebarFieldRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme?.palette?.grey?.[300] || '#d8dcde'};
`;

export const InlineEditContainer = styled.div`
  margin-top: 8px;
`;

export const SaveButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: ${props => props.theme?.palette?.blue?.[100] || '#edf7ff'};
  border-radius: 4px;
  margin-bottom: 16px;
  align-items: center;
`;

export const NotesEditButton = styled(Button)`
  position: absolute;
  bottom: 8px;
  right: 8px;
`;

export const NotesContentWrapper = styled.div`
  position: relative;
  min-height: 60px;
  padding-right: 80px;
`;

export const ConversationLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme?.palette?.blue?.[600] || '#1f73b7'};
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 0;
  text-align: left;
  
  &:hover {
    color: ${props => props.theme?.palette?.blue?.[700] || '#144a75'};
  }
`;

export const InternalNotesSection = styled.div`
  background-color: ${props => props.theme?.palette?.grey?.[100] || '#f8f9f9'};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 16px;
`;