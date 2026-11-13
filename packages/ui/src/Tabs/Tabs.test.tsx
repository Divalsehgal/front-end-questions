import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { TabPanel, Tabs } from '.';

type T = 'problem' | 'tests' | 'solution';

function Harness({ initial = 'problem' as T }) {
  const [tab, setTab] = useState<T>(initial);
  return (
    <>
      <Tabs
        id="t"
        label="Drill"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'problem', label: 'Problem', icon: <svg data-testid="icon" /> },
          { value: 'tests', label: 'Tests' },
          { value: 'solution', label: 'Solution' },
        ]}
        trailing={<span>Easy</span>}
      />
      <TabPanel id="t" value={tab}>
        Panel: {tab}
      </TabPanel>
    </>
  );
}

describe('Tabs', () => {
  it('links the tablist, tabs and panel with ARIA', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Drill' })).toBeInTheDocument();
    const problem = screen.getByRole('tab', { name: 'Problem' });
    expect(problem).toHaveAttribute('aria-selected', 'true');
    expect(problem).toHaveAttribute('aria-controls', 't-panel');
    const panel = screen.getByRole('tabpanel', { name: 'Problem' });
    expect(panel).toHaveTextContent('Panel: problem');
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps a single tab stop on the selected tab', () => {
    render(<Harness initial="tests" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
    expect(tabs[1]).toHaveClass('text-brand-strong', 'border-brand');
  });

  it('selects on click', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('tab', { name: 'Tests' }));
    expect(screen.getByRole('tab', { name: 'Tests' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel: tests');
  });

  it('moves focus and selection with arrows, Home and End', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Problem' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Tests' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Tests' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Solution' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Problem' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Solution' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel: problem');
  });

  it('ignores unrelated keys', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.tab();
    await user.keyboard('x');
    expect(screen.getByRole('tab', { name: 'Problem' })).toHaveAttribute('aria-selected', 'true');
  });
});
