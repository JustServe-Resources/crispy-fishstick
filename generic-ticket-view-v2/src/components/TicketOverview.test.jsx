import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TicketOverview from './TicketOverview';
import { useTicketLogic } from '../hooks/useTicketLogic';
import { DEFAULT_THEME, ThemeProvider } from '@zendeskgarden/react-theming';

// Mock the custom hook
vi.mock('../hooks/useTicketLogic');

// Mock KnowledgeGapSelector to avoid complex rendering and logic in this unit test
vi.mock('./KnowledgeGapSelector', () => ({
  default: () => <div data-testid="knowledge-gap-selector">Knowledge Gap Selector</div>
}));

// Mock zendesk garden components if necessary to avoid theme issues or jsdom limitations, 
// but often wrapping in ThemeProvider is enough.

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={DEFAULT_THEME}>
      {component}
    </ThemeProvider>
  );
};

describe('TicketOverview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    useTicketLogic.mockReturnValue({
      client: {},
      ticket: { type: 'incident', custom_fields: {} },
      pendingChanges: {},
      ticketFields: [],
      isStale: false,
      isEditingNotes: false,
      setIsEditingNotes: vi.fn(),
      refreshData: vi.fn(),
      handleFieldChange: vi.fn(),
    });

    renderWithTheme(<TicketOverview />);
    expect(screen.getByText('Internal Notes')).toBeDefined();
  });

  it('displays KnowledgeGapSelector when ticket type is "question" via pending changes', () => {
    useTicketLogic.mockReturnValue({
      client: {},
      ticket: { type: 'incident', custom_fields: {} }, // Original type
      pendingChanges: { type: 'question' }, // User changed to question
      ticketFields: [],
      isStale: false,
      isEditingNotes: false,
      setIsEditingNotes: vi.fn(),
      refreshData: vi.fn(),
      handleFieldChange: vi.fn(),
    });

    renderWithTheme(<TicketOverview />);
    expect(screen.getByTestId('knowledge-gap-selector')).toBeDefined();
  });

  it('displays KnowledgeGapSelector when ticket type is "question" via ticket data (no pending)', () => {
    useTicketLogic.mockReturnValue({
      client: {},
      ticket: { type: 'question', custom_fields: {} },
      pendingChanges: {},
      ticketFields: [],
      isStale: false,
      isEditingNotes: false,
      setIsEditingNotes: vi.fn(),
      refreshData: vi.fn(),
      handleFieldChange: vi.fn(),
    });

    renderWithTheme(<TicketOverview />);
    expect(screen.getByTestId('knowledge-gap-selector')).toBeDefined();
  });

  it('hides KnowledgeGapSelector when ticket type is NOT "question"', () => {
    useTicketLogic.mockReturnValue({
      client: {},
      ticket: { type: 'question', custom_fields: {} },
      pendingChanges: { type: 'task' }, // Changed to task
      ticketFields: [],
      isStale: false,
      isEditingNotes: false,
      setIsEditingNotes: vi.fn(),
      refreshData: vi.fn(),
      handleFieldChange: vi.fn(),
    });

    renderWithTheme(<TicketOverview />);
    // querying should return null
    expect(screen.queryByTestId('knowledge-gap-selector')).toBeNull();
  });
});
