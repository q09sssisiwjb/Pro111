import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DMCA() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold" data-testid="dmca-page-title">
              DMCA Policy
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground text-lg" data-testid="dmca-page-description">
          Digital Millennium Copyright Act Notice and Takedown Procedure
        </p>
      </div>

      <Card className="p-8 mb-8 bg-primary/5" data-testid="dmca-intro-card">
        <p className="text-muted-foreground leading-relaxed" data-testid="dmca-intro-text">
          Visionary AI respects the intellectual property rights of others and expects our users to do the same. 
          In accordance with the Digital Millennium Copyright Act (DMCA), we will respond to valid notices of 
          alleged copyright infringement and take appropriate action, which may include removing or disabling 
          access to material claimed to be infringing.
        </p>
      </Card>

      <div className="space-y-6">
        <Card className="p-6" data-testid="dmca-section-0">
          <h2 className="text-2xl font-semibold mb-4" data-testid="dmca-section-title-0">
            Reporting Copyright Infringement
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid="dmca-section-content-0">
            <p>
              If you believe that your copyrighted work has been copied in a way that constitutes copyright 
              infringement and is accessible on Visionary AI, please notify our Copyright Agent as set forth below.
            </p>
            <p>
              For your complaint to be valid under the DMCA, you must provide the following information in writing:
            </p>
          </div>
        </Card>

        <Card className="p-6" data-testid="dmca-section-1">
          <h2 className="text-2xl font-semibold mb-4" data-testid="dmca-section-title-1">
            Required Information for DMCA Notice
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid="dmca-section-content-1">
            <p className="ml-4">
              1. A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright interest
            </p>
            <p className="ml-4">
              2. Identification of the copyrighted work claimed to have been infringed, or if multiple works are covered by a single notification, a representative list of such works
            </p>
            <p className="ml-4">
              3. Identification of the material that is claimed to be infringing or to be the subject of infringing activity, including information reasonably sufficient to permit us to locate the material (e.g., URL or specific location on our platform)
            </p>
            <p className="ml-4">
              4. Your contact information, including your address, telephone number, and email address
            </p>
            <p className="ml-4">
              5. A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law
            </p>
            <p className="ml-4">
              6. A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed
            </p>
          </div>
        </Card>

        <Card className="p-6" data-testid="dmca-section-2">
          <h2 className="text-2xl font-semibold mb-4" data-testid="dmca-section-title-2">
            How to Submit a DMCA Notice
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid="dmca-section-content-2">
            <p>
              Please send your DMCA notice through our Contact Us page with the subject line "DMCA Takedown Request" 
              or via our support system. Include all required information listed above.
            </p>
            <p>
              Upon receipt of a valid DMCA notice, we will:
            </p>
            <p className="ml-4">• Remove or disable access to the allegedly infringing material</p>
            <p className="ml-4">• Notify the user who posted the material</p>
            <p className="ml-4">• Take reasonable steps to notify the user of the removal</p>
          </div>
          <div className="mt-6">
            <Button asChild variant="outline" data-testid="button-contact-dmca">
              <a href="/contact-us">Submit DMCA Notice</a>
            </Button>
          </div>
        </Card>

        <Card className="p-6" data-testid="dmca-section-3">
          <h2 className="text-2xl font-semibold mb-4" data-testid="dmca-section-title-3">
            Counter-Notification
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid="dmca-section-content-3">
            <p>
              If you believe that material you posted was removed or disabled by mistake or misidentification, 
              you may file a counter-notification with us. To be effective, a counter-notification must include:
            </p>
            <p className="ml-4">1. Your physical or electronic signature</p>
            <p className="ml-4">2. Identification of the material that has been removed or disabled and the location where it appeared before removal</p>
            <p className="ml-4">3. A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</p>
            <p className="ml-4">4. Your name, address, and telephone number</p>
            <p className="ml-4">5. A statement that you consent to the jurisdiction of the federal court in your district</p>
            <p>
              If a counter-notification is received, we may send a copy to the original complaining party. 
              If the copyright owner does not file a court action within 10 business days, we may restore the removed material.
            </p>
          </div>
        </Card>

        <Card className="p-6" data-testid="dmca-section-4">
          <h2 className="text-2xl font-semibold mb-4" data-testid="dmca-section-title-4">
            Repeat Infringer Policy
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed" data-testid="dmca-section-content-4">
            <p>
              Visionary AI has adopted a policy of terminating, in appropriate circumstances, users who are deemed 
              to be repeat infringers. We may also, at our sole discretion, limit access to the platform and/or 
              terminate the accounts of any users who infringe any intellectual property rights of others, whether 
              or not there is any repeat infringement.
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-amber-50 dark:bg-amber-950/20" data-testid="dmca-warning-card">
          <h2 className="text-xl font-semibold mb-4" data-testid="dmca-warning-title">
            Important Notice
          </h2>
          <p className="text-muted-foreground leading-relaxed" data-testid="dmca-warning-text">
            Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material 
            or activity is infringing may be subject to liability. Please ensure that your DMCA notice is accurate 
            and made in good faith. False claims may result in legal consequences.
          </p>
        </Card>
      </div>
    </div>
  );
}
