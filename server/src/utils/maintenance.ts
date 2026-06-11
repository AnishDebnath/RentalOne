import supabase from '@camera-rental-house/database';

export const runRentalMaintenance = async () => {
  console.log('[Maintenance] Checking for expired rentals (not collected within 24h)...');
  
  const now = new Date();
  const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  try {
    // Find confirmed rentals that are past the 24h collection window
    const { data: expiredRentals, error: fetchError } = await supabase
      .from('rentals')
      .select('id, rental_no')
      .eq('status', 'confirmed')
      .lt('pickup_date', threshold.toISOString());

    if (fetchError) {
      console.error('[Maintenance] Error fetching expired rentals:', fetchError);
      return;
    }

    if (!expiredRentals || expiredRentals.length === 0) {
      console.log('[Maintenance] No uncollected rentals found.');
      return;
    }

    console.log(`[Maintenance] Found ${expiredRentals.length} expired rentals. Processing cancellation...`);

    for (const rental of expiredRentals) {
      // 1. Cancel the main rental
      const { error: updateRentalError } = await supabase
        .from('rentals')
        .update({ status: 'cancelled' })
        .eq('id', rental.id);

      if (updateRentalError) {
        console.error(`[Maintenance] Error cancelling rental ${rental.rental_no}:`, updateRentalError);
        continue;
      }

      // 2. We don't need to update rental_items anymore. 
      // The rental status is 'cancelled', so enrichProduct will not see it as 'confirmed' or 'active' and stock is freed.
      // But we can also update the products JSONB array status to 'cancelled' for consistency.
      const { data: currentRental } = await supabase.from('rentals').select('products').eq('id', rental.id).single();
      const updatedProducts = (currentRental?.products || []).map((p: any) => ({ ...p, status: 'cancelled' }));
      
      const { error: updateItemsError } = await supabase
        .from('rentals')
        .update({ products: updatedProducts })
        .eq('id', rental.id);

      if (updateItemsError) {
        console.error(`[Maintenance] Error updating products for rental ${rental.rental_no}:`, updateItemsError);
      } else {
        console.log(`[Maintenance] Successfully cancelled rental ${rental.rental_no} and released items.`);
      }
    }
  } catch (error) {
    console.error('[Maintenance] Unexpected error during cleanup:', error);
  }
};

/**
 * Start the maintenance background worker
 * @param intervalMs How often to run the check (default: 1 hour)
 */
export const startMaintenanceWorker = (intervalMs = 60 * 60 * 1000) => {
  // Run once on startup
  runRentalMaintenance();
  
  // Schedule periodic runs
  setInterval(runRentalMaintenance, intervalMs);
  
  console.log(`[Maintenance] Background worker started. Checks every ${intervalMs / (60 * 1000)} minutes.`);
};
