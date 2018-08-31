export default class Issue {
    constructor(
        id,
        author,
        name,
        description,
        group,
        dateLastActivity,
        attachments,
        meta
    ) {
        // Native fields
        this.id               = id;
        this.author           = author;
        this.name             = name;
        this.desc             = description;
        this.group            = group;
        this.dateLastActivity = dateLastActivity;
        this.meta             = JSON.parse(meta);
        this.attachments      = attachments;

        // Calculate fields
        this.idList           = this.group.id;
        this.url              = 'https://bugkiller.disko.fr/issues/' + this.id;

        this.screenshots      = this.attachments.map(attachment => {
            let screenshot = {
                id: attachment.id,
                url: attachment.content_url,
                preview: attachment.thumbnail_url
            }
            return screenshot;
        });
    }
}
