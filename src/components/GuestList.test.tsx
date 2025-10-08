import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GuestList } from './GuestList';
import { Guest } from '../types';

describe('GuestList', () => {
  const baseGuests: Guest[] = [
    {
      id: 1,
      name: '山田 太郎',
      gender: 'male',
      isPresent: true,
      checkedInAt: new Date('2024-01-01T10:00:00Z')
    },
    {
      id: 2,
      name: '佐藤 花子',
      gender: 'female',
      isPresent: false
    }
  ];

  it('現在の出席・未到着人数を表示し、出席状態の切り替えを呼び出す', async () => {
    const onToggleAttendance = vi.fn();
    const user = userEvent.setup();

    render(
      <GuestList
        guests={baseGuests}
        onToggleAttendance={onToggleAttendance}
      />
    );

    expect(screen.getByText('出席済み (1名)')).toBeInTheDocument();
    expect(screen.getByText('未到着 (1名)')).toBeInTheDocument();

    expect(screen.getByText('山田 太郎')).toHaveClass('latest-checkin');

    await user.click(screen.getByRole('button', { name: '取消' }));
    expect(onToggleAttendance).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('button', { name: '手動受付' }));
    expect(onToggleAttendance).toHaveBeenCalledWith(2);
  });
});
