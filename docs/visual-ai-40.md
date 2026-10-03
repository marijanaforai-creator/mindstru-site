# Marijana Visual AI — 40 koraka

01 Text→Image · 02 Image→Image · 03 Prompt Director · 04 Style Studio · 05 Brand Lock · 06 Product Scene · 07 Pinterest Generator · 08 Social Pack · 09 Mockup Generator · 10 Campaign Visuals · 11 Visual Variations · 12 Image→Video · 13 Composition Director · 14 Lighting Director · 15 Camera Director · 16 Color Director · 17 Typography Safe Area · 18 Background Generator · 19 Product Isolation · 20 Scene Expansion · 21 Creative Brief · 22 Art Direction · 23 Visual Consistency · 24 Character Consistency · 25 Product Consistency · 26 Reference Image · 27 Style Reference · 28 Batch Generation · 29 A/B Creative Variants · 30 Format Adaptation · 31 Campaign Kit · 32 Reel Cover Kit · 33 Pinterest Kit · 34 Story Kit · 35 Ad Creative Kit · 36 Video Storyboard · 37 Shot List · 38 Voice/Video Handoff · 39 Asset Library · 40 Creative Analytics.

## Architecture
UI → Creative Brief → Visual Orchestrator → Provider Adapter → Job Queue → Asset/Variant Library → Content/Mockup/Video/Campaign modules.

Provider adapter is deliberately abstracted. The repository does not claim a live Midjourney or video-provider connection until credentials/API support are actually configured.