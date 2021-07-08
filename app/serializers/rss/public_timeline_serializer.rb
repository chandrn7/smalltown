# frozen_string_literal: true

class RSS::PublicTimelineSerializer < RSS::Serializer
    include ActionView::Helpers::NumberHelper
    include RoutingHelper
  
    def render(statuses)
      builder = RSSBuilder.new
  
      builder.title("#{Setting.site_title}")
             .description(I18n.t('about.about_public_timeline_html', title: Setting.site_title))
  
      render_statuses(builder, statuses)
  
      builder.to_xml
    end
  
    def self.render(statuses)
      new.render(statuses)
    end
  end