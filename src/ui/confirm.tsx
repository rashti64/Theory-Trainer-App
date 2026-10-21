/**
 * The app's own confirmation dialog. Native Alert dialogs do nothing on the
 * web (and browsers can block confirm()), so every "are you sure?" goes
 * through this instead: `const ok = await confirm({...})`.
 */
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText, RaisedButton } from './components';
import { colors, fonts, radius, space } from './theme';

export type ConfirmOptions = {
  title: string;
  body?: string;
  confirmLabel: string;
  /** Leave out for a plain notice with one button. */
  cancelLabel?: string;
  destructive?: boolean;
};

type Pending = ConfirmOptions & { resolve: (ok: boolean) => void };

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null);
  const current = useRef<Pending | null>(null);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        current.current?.resolve(false);
        const next = { ...options, resolve };
        current.current = next;
        setPending(next);
      }),
    [],
  );

  const close = (ok: boolean) => {
    current.current?.resolve(ok);
    current.current = null;
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal visible={pending !== null} transparent animationType="fade" onRequestClose={() => close(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => close(false)} accessibilityLabel={pending?.cancelLabel ?? pending?.confirmLabel} />
          {pending ? (
            <View style={styles.card} accessibilityRole="alert" accessibilityViewIsModal>
              <AppText style={styles.title}>{pending.title}</AppText>
              {pending.body ? <AppText color={colors.slate}>{pending.body}</AppText> : null}
              <View style={styles.actions}>
                <RaisedButton
                  label={pending.confirmLabel}
                  tone={pending.destructive ? 'danger' : 'primary'}
                  onPress={() => close(true)}
                />
                {pending.cancelLabel ? (
                  <RaisedButton label={pending.cancelLabel} tone="neutral" onPress={() => close(false)} />
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmContext);
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 42, 51, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.xl,
    gap: space.md,
  },
  title: { fontFamily: fonts.black, fontSize: 22, lineHeight: 27, color: colors.asphalt },
  actions: { gap: space.sm, marginTop: space.sm },
});
