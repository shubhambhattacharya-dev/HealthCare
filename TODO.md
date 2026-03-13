# TODO: Fix Subscription Credit Updates

## Plan Breakdown:
- [x] Step 1: Fix PLAN_CREDITS & PLAN_MAP consistency in all files
- [x] Step 2: Update webhook logic - set exact credits, add error handling, revalidate  
- [x] Step 3: Update credits.js sync function
- [x] Step 4: Update checkUser.js fallback sync
- [x] Step 5: Add manual sync button in UI (via syncCreditsWithPlan)
- [x] Step 6: Test webhook + verify 
  - Manual sync button added
  - Downgrade logic fixed
