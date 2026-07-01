import { useRef, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const safeRows = (rows: any) => (Array.isArray(rows) ? rows : []);

const ESTIMATED_ROW_HEIGHT = 72;
const OVERSCAN = 10;

const VirtualizedDataTable = ({ columns, rows, renderMobileCard, visibleCount = 0 }) => {
    const data = safeRows(rows);
    const count = visibleCount ?? data.length;
    const parentRef = useRef(null);

    const virtualizer = useVirtualizer({
        count,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ESTIMATED_ROW_HEIGHT,
        overscan: OVERSCAN,
    });

    return (
        <>
            {/* Desktop — virtualized */}
            <div
                ref={parentRef}
                className="hidden overflow-auto rounded-[1rem] border border-line bg-white shadow-sm xl:block"
                style={{ maxHeight: 'calc(100vh - 280px)' }}
            >
                <div style={{ height: virtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
                    {/* Sticky header */}
                    <div className="sticky top-0 z-10 flex items-center border-b border-line bg-white/95 px-4 backdrop-blur-sm">
                        {columns.map((col) => (
                            <div
                                key={col.key}
                                className={`py-3 text-left text-[11px] font-bold uppercase tracking-wider text-tertiary ${col.className || ''}`}
                            >
                                {col.label}
                            </div>
                        ))}
                    </div>
                    {/* Virtual rows */}
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const row = data[virtualItem.index];
                        if (!row) return null;
                        return (
                            <div
                                key={row.id}
                                className="flex items-center border-b border-line/60 px-4 text-sm font-medium text-muted transition hover:bg-primary-light/70"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: virtualItem.size,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                {columns.map((col) => (
                                    <div key={col.key} className={`${col.className || ''}`}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile — not virtualized (fewer items visible) */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:hidden">
                {data.slice(0, count).map((row, idx) => (
                    <div key={row.id} className={idx < count ? 'card-entrance' : 'card-hidden'}>
                        {renderMobileCard(row)}
                    </div>
                ))}
            </div>
        </>
    );
};

export default memo(VirtualizedDataTable);
